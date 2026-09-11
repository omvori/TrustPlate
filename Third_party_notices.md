# Third-Party Notices

TrustPlate is built on top of several open-source and open-weight components.
This file lists each of them, their license, and — where relevant — usage
notes specific to how they are used in this project.

This document is provided for transparency and academic completeness.
It is not a substitute for legal advice.

---

## AI Models

### GLiNER2
- **Used for**: content moderation (offensive content classification)
- **Repository**: https://github.com/fastino-ai/GLiNER2
- **License**: Apache License 2.0
- **Copyright**: Fastino AI
- **Note**: this project uses a custom fine-tuned adapter (v5) trained on top
  of the `fastino/gliner2-base-v1` checkpoint. The base model and library
  code are unmodified; only an additional adapter was trained.

Citation:
```bibtex
@inproceedings{zaratiana-etal-2025-gliner2,
    title = "{GL}i{NER}2: Schema-Driven Multi-Task Learning for Structured Information Extraction",
    author = "Zaratiana, Urchade  and
      Pasternak, Gil  and
      Boyd, Oliver  and
      Hurn-Maloney, George  and
      Lewis, Ash",
    editor = {Habernal, Ivan  and
      Schulam, Peter  and
      Tiedemann, J{\"o}rg},
    booktitle = "Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing: System Demonstrations",
    month = nov,
    year = "2025",
    address = "Suzhou, China",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2025.emnlp-demos.10/",
    pages = "130--140",
    ISBN = "979-8-89176-334-0",
    abstract = "Information extraction (IE) is fundamental to numerous NLP applications, yet existing solutions often require specialized models for different tasks or rely on computationally expensive large language models. We present GLiNER2, a unified framework that enhances the original GLiNER architecture to support named entity recognition, text classification, and hierarchical structured data extraction within a single efficient model. Built on a fine-tuned encoder architecture, GLiNER2 maintains CPU efficiency and compact size while introducing multi-task composition through an intuitive schema-based interface. Our experiments demonstrate competitive performance across diverse IE tasks with substantial improvements in deployment accessibility compared to LLM-based alternatives. We release GLiNER2 as an open-source library available through pip, complete with pre-trained models and comprehensive documentation."
}
}
```

### Ollama (runtime)
- **Used for**: local inference server for all LLMs used in the project
- **Repository**: https://github.com/ollama/ollama
- **License**: MIT License

### Gemma models (`gemma3:4b`, `gemma4:e2b`)
- **Used for**: mood/summary generation and the RAG chatbot's answer generation
- **Publisher**: Google DeepMind
- **License**: **Gemma Terms of Use** — https://ai.google.dev/gemma/terms
  (Gemma 4 models are licensed separately, see the Gemma 4 license at the
  same page)
- ⚠️ **Important distinction**: unlike the other components in this file,
  Gemma models are **not** Apache/MIT-licensed. They are distributed under
  Google's own custom terms, which include a Prohibited Use Policy and
  usage restrictions that apply to anyone using, distributing, or building
  on top of the model — including via a local tool like Ollama. If this
  project is ever distributed, deployed for others to use, or built upon
  commercially, the Gemma Terms of Use (not just this notice) should be
  reviewed directly at the link above.

### Qwen3-Embedding (`qwen3-embedding:0.6b`)
- **Used for**: generating embeddings for the RAG vector store
- **Publisher**: Alibaba / Qwen Team
- **License**: check the specific model card on the model's Hugging Face /
  Ollama page for the exact license version in use, as terms can vary by
  model size and release.

---

## Backend (Python)

| Component | Used for | License |
|---|---|---|
| [Flask](https://github.com/pallets/flask) | Backend REST API | BSD-3-Clause |
| [flask-cors](https://github.com/corydolphin/flask-cors) | CORS handling | MIT |
| [spaCy](https://github.com/explosion/spaCy) (`it_core_news_sm`) | Italian NLP | MIT |
| [Faker](https://github.com/joke2k/faker) | Synthetic review generation (seeding) | MIT |
| [bleach](https://github.com/mozilla/bleach) | HTML sanitization of review input | Apache License 2.0 |
| [LangChain](https://github.com/langchain-ai/langchain) | RAG chain orchestration (`ragBotTP`) | MIT |
| [Chroma](https://github.com/chroma-core/chroma) | Vector store for RAG (`ragBotTP`) | Apache License 2.0 |

---

## Frontend (TypeScript / JavaScript)

| Component | Used for | License |
|---|---|---|
| [Angular](https://github.com/angular/angular) | Frontend framework | MIT |
| [Angular Material](https://github.com/angular/components) | UI components | MIT |
| [marked](https://github.com/markedjs/marked) | Markdown rendering (chatbot responses) | MIT |
| [DOMPurify](https://github.com/cure53/DOMPurify) | HTML sanitization of rendered chatbot output | Apache License 2.0 / Mozilla Public License 2.0 (dual-licensed) |

---

## Summary of obligations

For the Apache 2.0 and MIT-licensed components above, this project complies
by:
- Retaining this notice file, listing each component and its license
- Not misrepresenting authorship of third-party code
- Not modifying the source of these libraries (only using their public
  APIs), with the sole exception of the GLiNER2 adapter, which is an
  additional trained artifact, not a modification of GLiNER2's own code

The **Gemma models are the one exception** to treat separately: their terms
go beyond attribution and include usage restrictions defined by Google. If
in doubt about a specific use case, refer directly to
https://ai.google.dev/gemma/terms rather than to this summary.

---

*Last updated: for the TrustPlate academic project (Lazio Digital ITS Academy / Exprivia).*
