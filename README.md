# TrustPlate – Rate restaurants with confidence (Flask + Angular + AI)

## Overview

**TrustPlate** is a web platform that allows users to **leave reviews** on restaurants, **consult them**, and **interact** via a like/dislike system (`gradimento` / `contrasto`).

The backend is built with **Flask** and exposes a RESTful API. The frontend is built with **Angular**. Reviews are persisted in a JSON file.

Three AI components are integrated directly into the review lifecycle:

- **Content moderation** — a fine-tuned classification model blocks offensive reviews before they are ever published.
- **Mood analysis & summarization** — a local LLM generates a critical summary of all reviews for a restaurant, on demand.
- **RAG chatbot ("Reggie")** — a conversational assistant, running as a separate microservice, answers user questions grounded in real review data.

> This is the main application repository. The RAG chatbot lives in a separate repository — see [Architecture & related repositories](#architecture--related-repositories) below, it **must be running** for the chat feature to work.

---

## Why this project matters beyond restaurants

TrustPlate was built around restaurant reviews, but the underlying problem it solves is **not specific to restaurants**: any platform that collects user-generated content (reviews, comments, support tickets, community posts) faces the same three needs —

1. **Filter** harmful or noisy content before it reaches other users
2. **Summarize** large volumes of unstructured text into something actionable in seconds
3. **Make the accumulated knowledge queryable** through a conversational interface grounded in real data, instead of forcing users to read everything manually

Each AI module in TrustPlate is designed as a self-contained service communicating over REST, which means the same pattern is directly reusable in other domains:

| Module | Reusable as | Example domains |
|---|---|---|
| Moderation (GLiNER2) | `moderation-as-a-service` | e-commerce reviews, community platforms, comment sections |
| Summarizer (Ollama) | `summarizer-as-a-service` | customer feedback, survey responses, support ticket triage |
| RAG chatbot (Reggie) | `rag-as-a-service` | internal knowledge bases, customer support, documentation Q&A |

The current implementation is a single-domain application, but the architecture — frontend talking to independent, REST-exposed AI services rather than tightly-coupled logic — is what would make this evolution possible without a rewrite. See [Scalability](#scalability--future-evolution) for more detail.

---

## Main Features

- **List reviews** – `GET /api/reviews` returns all reviews (first name, last name, text, restaurant id).
- **Add review** – `POST /api/reviews` creates a new review, running it through the moderation pipeline before persisting it.
- **Like/Dislike** – `PUT /api/reviews/<id>/gradimento` and `/contrasto` increase/decrease counters.
- **Seed data** – `GET /api/seed/<number>` generates random reviews using Faker and predefined positive/neutral/negative sentences.
- **Mood analysis with Ollama** – on-demand endpoint that queries a local LLM to return an aggregated sentiment summary for a restaurant.
- **RAG chatbot ("Reggie")** – conversational Q&A grounded in the actual review dataset, served by a separate microservice.

---

## AI Components — in detail

### 1. Content moderation (GLiNER2)

Every review is analyzed **before** being persisted. The model used is [GLiNER2](https://github.com/fastino-ai/GLiNER2), a compact classification model — chosen over a general-purpose LLM specifically because of its low inference latency, which matters for a synchronous, in-the-request-path check like this one.

```python
schema = extractor.create_schema().classification(
    "sentiment",
    ["positive", "negative", "offensive"],
    multi_label=True,
    cls_threshold=0.3
)

results = extractor.extract(testo_pulito, schema, include_confidence=True)

offensive_score = next(
    (item["confidence"] for item in results.get('sentiment', []) if item["label"] == "offensive"),
    0
)

if offensive_score > 0.5:
    return jsonify({"error": "Recensione bloccata per contenuto offensivo"}), 403
```

**Training approach.** The base model was fine-tuned on a custom dataset built from recurring insults and offensive language found in Italian social media comments, labeled across three classes (`positive`, `negative`, `offensive`). Five adapter versions were trained and compared; the two most relevant:

| Adapter | Balancing technique | Accuracy | F1 — Negative | F1 — Offensive | F1 — Positive |
|---|---|---|---|---|---|
| v4 | Undersampling | 0.89 | 0.76 | 0.85 | 0.99 |
| **v5** (used in production) | Oversampling | **0.91** | 0.79 | 0.89 | 0.99 |

**v5 was selected** because it improves recall on the class that matters most for moderation — `offensive` (0.82 → 0.91) — at an acceptable cost to recall on the `negative` class (0.81 → 0.75). A missed offensive review is a worse outcome than an over-flagged negative one.

**Note on input sanitization.** GLiNER2 classifies semantic content — it does **not** sanitize markup. Raw review text is passed through [`bleach`](https://github.com/mozilla/bleach) (`bleach.clean(tags=[], strip=True)`) immediately after being read from the request, *before* classification, to strip any HTML/script content. This matters because the same text later flows into the RAG vector store (see below) — sanitizing late would leave a stored-XSS surface upstream of the chatbot.

### 2. Mood analysis & summarization (Ollama · gemma3:4b)

For any restaurant, the user can trigger a summary of all its reviews on demand. The backend collects every review text for that `idRistorante`, builds a prompt, and sends it to a local Ollama instance:

```python
promptTemplate = f"""Sei un analista esperto e conciso di recensioni.
Ecco un elenco di recensioni reali:

{testoRecensioni}

Compito:
## Descrivi l'opinione generale in una frase di 5 righe massimo.
   Elencando eventuali problemi gravi (es. igiene, allergie) con un elenco puntato.
## Valutazione: Assegna un voto da 1 a 5 stelle usando l'emoji ⭐.

Vincoli:
- Sii moderatamente sintetico.
- Non usare frasi introduttive o di chiusura."""
```

The response is a short natural-language critique plus a synthetic star rating, rendered directly in the restaurant page. A secondary, smaller prompt additionally reduces the same summary to 3 keyword "mood chips" (e.g. *"Accogliente · Autentico · Affollato"*) for an even faster read.

### 3. RAG chatbot ("Reggie") — separate microservice

Reggie is a Retrieval-Augmented Generation chatbot, implemented as its own Flask service (see [ragBotTP](#architecture--related-repositories)) so that the vector store, embedding model and LLM lifecycle stay decoupled from the main application.

**Pipeline:**
1. All reviews are embedded (`qwen3-embedding:0.6b` via Ollama) and stored in a **Chroma** vector store, one document per review, formatted as `"Ristorante {nome}: {testoRecensione}"`.
2. On a user query, the top-k most relevant review chunks are retrieved (`k=4`).
3. The retrieved context is injected into a constrained prompt template and sent to a local LLM (`gemma4:e2b`, temperature `0`) via [LangChain](https://www.langchain.com/)'s `RetrievalQA` chain.
4. The model is explicitly instructed to answer **only** from the provided context, in at most 3 bullet points, in a polite tone — reducing hallucinated or out-of-context answers.

```python
chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectors.as_retriever(search_kwargs={"k": 4}),
    chain_type_kwargs={"prompt": PromptTemplate.from_template(PROMPT_TEMPLATE)},
    return_source_documents=True,
)
```

The endpoint returns both the generated `answer` and the raw `source_documents` used to produce it — useful for debugging retrieval quality independently of generation quality.

---

## Scalability & future evolution

The three AI modules above are already isolated behind their own logic and, in the case of the chatbot, behind their own process and REST API. That separation is what makes the following evolution realistic without rewriting the application:

```
Today                              Possible evolution
──────────────────────             ─────────────────────────────────
TrustPlate (monolith)              Moderation-as-a-Service   → e-commerce, community platforms
 ├─ Moderation                     Summarizer-as-a-Service   → feedback, surveys, support tickets
 ├─ Summarizer          ──────►    RAG-as-a-Service          → internal knowledge bases, helpdesks
 └─ RAG chat (Reggie)
```

Concretely, turning this into reusable services would mean:
- Standardizing all three modules behind versioned REST endpoints (`POST /moderate`, `POST /summarize`, `POST /chat`), independent of the `testoRecensione` / `idRistorante` shape they currently expect
- Moving **all** AI calls behind the backend (currently the mood-summary call is made directly from the Angular frontend to Ollama — see [Known limitations](#known-limitations--local-execution)), so that any consumer only ever talks to a REST API, never to the underlying model host directly
- Replacing the local Ollama models with hosted/production-grade inference where latency and concurrency requirements demand it

---

## Known limitations & local execution

All models currently run **locally via Ollama**. This was a pragmatic choice for the development phase, not an architectural decision:

- **Iteration speed** — training and comparing 5 moderation adapters, and iterating on prompts for the summarizer and chatbot, required unlimited, free, low-latency calls during development.
- **Data control** — no review data or test prompts left the local machine during experimentation.
- **Not production-final** — in a real deployment, local models would be replaced with hosted, faster, horizontally scalable inference, consistent with the microservice direction described above.

A secondary known limitation: the mood-summary feature currently calls Ollama **directly from the Angular frontend**, while the chatbot calls it **through the Flask backend**. This is an inconsistency inherited from iterative development, not an intended design — a production-ready version would route both through the backend, so the model host is never exposed to the browser directly (this also closes off a class of API-abuse vectors, since the model endpoint would no longer be reachable from client-side JavaScript at all).

---

## Technology Stack

| Component       | Technology used                                       |
|-----------------|-------------------------------------------------------|
| Frontend        | Angular + Angular Material                            |
| Backend         | Python 3.8+ · Flask · flask-cors                       |
| Persistence     | JSON file (`reviews.json`)                            |
| Moderation      | GLiNER2 + custom fine-tuned adapter (v5)               |
| Summarization   | Ollama · `gemma3:4b`                                   |
| RAG chatbot     | LangChain · Chroma · Ollama (`gemma4:e2b`, `qwen3-embedding:0.6b`) |
| Sanitization    | `bleach` (backend) · `DOMPurify` (frontend)            |
| Data generation | Faker (Italian) + manual sentence lists                |
| Base NLP        | spaCy + `it_core_news_sm`                              |

---

## Architecture & related repositories

TrustPlate is split across two repositories that must run together for the full feature set (chatbot included) to work:

| Repository | Role | Port |
|---|---|---|
| [`TrustPlate`](https://github.com/omvori/TrustPlate) (this repo) | Angular frontend + Flask backend + moderation + summarizer | `4200` (frontend) / `5000` (backend) |
| [`ragBotTP`](https://github.com/omvori/ragBotTP) | RAG chatbot microservice (Reggie) — Chroma vector store + LangChain + Ollama | `5001` |

```
Angular (4200) ──REST──► Flask backend (5000) ──REST──► Ollama (11434)   [reviews, moderation, summary]
Angular (4200) ──REST──────────────────────────────────► ragBotTP (5001) ──REST──► Ollama (11434)   [chat]
```

Both services depend on a local **Ollama** instance (`ollama serve`) with the required models pulled.

### Running the full stack

```bash
# 1. Start Ollama (required by both services)
ollama serve
ollama pull gemma3:4b
ollama pull gemma4:e2b
ollama pull qwen3-embedding:0.6b

# 2. Start the RAG chatbot microservice (separate repo)
git clone https://github.com/omvori/ragBotTP.git
cd ragBotTP
pip install -r requirements.txt --break-system-packages
python app.py          # runs on http://0.0.0.0:5001

# 3. In a separate terminal, start this repository
git clone https://github.com/omvori/TrustPlate.git
cd TrustPlate/backend
python -m venv venv && source venv/bin/activate
pip install flask flask_cors faker spacy bleach
python -m spacy download it_core_news_sm
python server_flask.py     # runs on http://127.0.0.1:5000

# 4. Start the frontend
cd ../
npm install
ng serve                   # runs on http://localhost:4200
```

> If Reggie's chat window shows a generic error, check that `ragBotTP` is running on port `5001` and that Ollama has all three models pulled — the chatbot silently depends on all of them.

---

## API Endpoints (main backend)

| Method | Endpoint                                 | Description |
|--------|-------------------------------------------|-------------|
| GET    | `/api/isUp`                              | Health check → `{stato: "ok"}` |
| GET    | `/api/reviews`                           | Returns all reviews |
| POST   | `/api/reviews`                           | Adds a review — sanitized, then moderated, then persisted |
| DELETE | `/api/clear`                             | Deletes all reviews |
| PUT    | `/api/reviews/<review_id>/gradimento`    | Increments like counter |
| PUT    | `/api/reviews/<review_id>/contrasto`     | Decrements dislike counter |
| GET    | `/api/seed/<int:numero>`                 | Generates `numero` random reviews |
| POST   | `/api/rag/chat`                          | Proxies a chat query to the `ragBotTP` microservice |

### `ragBotTP` microservice endpoints

| Method | Endpoint  | Description |
|--------|-----------|-------------|
| GET    | `/health` | Health check → `{status: "ALIVE"}` |
| POST   | `/chat`   | `{ "query": "..." }` → `{ "answer": "...", "sources": [...] }` |

---

## License

Academic project — Lazio Digital ITS Academy, in collaboration with Exprivia.
