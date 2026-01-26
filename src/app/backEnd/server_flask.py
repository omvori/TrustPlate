from flask_cors import CORS
import json
import os 
from flask import Flask, jsonify, request
import uuid
from faker import Faker
import random


app = Flask(__name__)
CORS(app)

review_list = []

@app.route('/api/isUp',methods=['GET'])
def isUp():
    return jsonify({"stato": "ok","message":"Server flask acceso"}),200


#ottengo le recensioni 
@app.route('/api/reviews',methods=['GET'])
def get_reviews():
    if not review_list:
        return jsonify([
            {"nome":"Mario",
             "cognome":"Rossi",
             "testoRecensione":"servizio eccellente molto soddisfatto",
             "idRistorante": "2"}
        ])
    return jsonify(review_list)

#aggiungo recensioni
@app.route('/api/reviews',methods=['POST'])
def add_review():

    try:
        data = request.json

        nuova_recensione = {
            "id":str(uuid.uuid4()),
            "nome": data.get('nome'),
            "cognome":data.get('cognome',''),
            "testoRecensione": data.get('testoRecensione'),
            "idRistorante": data.get('idRistorante',''),
            "gradimento": 0,
            "contrasto" : 0
        }
        review_list.append(nuova_recensione)

        with open('reviews.json','w') as file:
            json.dump(review_list,file,indent=2)
        
        return jsonify(nuova_recensione),201

    except Exception as e:
        return jsonify({"error":str(e)}),500

#cancello recensioni
@app.route('/api/clear',methods=['DELETE'])
def clear_reviews():

    review_list.clear()

    with open('reviews.json','w') as file:
        json.dump([],file)

    return jsonify({"message":"recensioni cancellate con successo"})

#carico recensioni dal json
def load_reviews():
    global review_list

    try: 
        if os.path.exists('reviews.json'):
            with open('reviews.json','r') as file:
                review_list = json.load(file)
        else:
            review_list = [
                {"nome": "Mario",
                 "cognome":"Rossi",
                 "testoRecensione":"Molto buona,soddisfatto",
                 "idRistorante":"1"}
            ]
            with open('reviews.json','w') as file:
                json.dump(review_list,file,indent=2)
    except:
        review_list = []


#update dei like
@app.route('/api/reviews/<review_id>/gradimento',methods=['PUT'])
def update_gradimento(review_id):
    try:
        data = request.json
        incremento = data.get('incremento',0)

        for recensione in review_list:
            if recensione['id'] == review_id:
                recensione['gradimento'] = recensione.get('gradimento') + incremento

                with open('reviews.json','w') as file:
                    json.dump(review_list,file,indent=2)

                return jsonify({
                    "success":True,
                    "nuovo_gradimento":recensione['gradimento']
                }), 200
        return jsonify({"error":"recensione non trovata"}),404
    
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
#update dei dislike
@app.route('/api/reviews/<review_id>/contrasto',methods=['PUT'])
def update_contrasto(review_id):
    try:
        data = request.json
        decremento = data.get('decremento',0)

        for recensione in review_list:
            if recensione['id'] == review_id:
                recensione['contrasto'] = recensione.get('contrasto') - decremento

                with open('reviews.json','w') as file:
                    json.dump(review_list,file,indent=2)

                return jsonify({
                    "success":True,
                    "nuovo_contrasto":recensione['contrasto']
                }), 200
        return jsonify({"error":"recensione non trovata"}),404
    
    except Exception as e:
        return jsonify({"error":str(e)}),500

#METODO PER POPOLARE IL SITO, USARE CON CAUTELA#
@app.route('/api/seed/<int:numero>', methods=['GET'])
def seed_data(numero):
    fake = Faker('it_IT')
    nuove = []

    positive = [
    "Cibo davvero ottimo e personale gentilissimo!",
    "La migliore carbonara che abbia mai mangiato in vita mia.",
    "Atmosfera accogliente e piatti curati nei minimi dettagli.",
    "Prezzo onesto per la qualità offerta. Torneremo sicuramente.",
    "Servizio impeccabile e veloce, consigliatissimo!",
    "Una bellissima scoperta, tutto delizioso dall'antipasto al dolce.",
    "Locale molto pulito e ben organizzato, complimenti.",
    "Il pesce era freschissimo, cucinato alla perfezione.",
    "Personale sorridente e disponibile, ci siamo sentiti a casa.",
    "La pizza era leggera e croccante, ingredienti di prima scelta.",
    "Rapporto qualità-prezzo imbattibile in questa zona.",
    "Un'esperienza gastronomica indimenticabile, bravi!",
    "Il tiramisù fatto in casa è qualcosa di spettacolare.",
    "Location suggestiva, perfetta per una cena romantica.",
    "Cucina autentica e sapori genuini, come una volta.",
    "Siamo rimasti colpiti dalla gentilezza del proprietario.",
    "Vasta scelta di vini e ottimi consigli del sommelier.",
    "I piatti sono arrivati caldi e in tempi rapidissimi.",
    "Porzioni abbondanti e prezzi molto competitivi.",
    "Senza dubbio il miglior ristorante della città.",
    "Ambiente raffinato ma non pretenzioso, ci è piaciuto molto.",
    "La carne si scioglieva in bocca, cottura eccellente.",
    "Ottima opzione anche per vegetariani, piatti molto creativi.",
    "Servizio attento ma mai invadente, serata perfetta.",
    "Ho festeggiato qui il mio compleanno ed è stato tutto magnifico.",
    "Materie prime di altissima qualità, si sente la differenza.",
    "Un posto dove si mangia bene e si spende il giusto.",
    "Il menu degustazione è un viaggio nei sapori, da provare.",
    "Staff giovane, dinamico e molto preparato.",
    "I dolci sono la fine del mondo, tenetevi uno spazio!",
    "Pulizia top e rispetto delle norme igieniche.",
    "Ci vado spesso e non sbagliano mai un colpo.",
    "L'antipasto della casa è ricco e sfizioso.",
    "Hanno accolto il nostro cane con una ciotola d'acqua, molto gentili.",
    "Arredamento moderno e musica di sottofondo piacevole.",
    "Un gioiellino nascosto, felice di averlo trovato.",
    "La pasta fatta in casa ha tutto un altro sapore.",
    "Cocktail buonissimi per accompagnare la cena.",
    "Cura del cliente eccezionale, torneremo presto.",
    "Il risotto era mantecato alla perfezione.",
    "Pausa pranzo veloce ma di qualità, bravi.",
    "Adoro questo posto, è il mio ristorante preferito.",
    "Ogni piatto è una piccola opera d'arte.",
    "Hanno gestito benissimo la nostra tavolata numerosa.",
    "Frittura di pesce leggera e non unta, ottima.",
    "Un esempio di come si dovrebbe gestire un ristorante.",
    "Semplicemente perfetto, non ho altro da aggiungere.",
    "Meritano sicuramente una stella per l'impegno.",
    "Pane e grissini fatti in casa, dettagli che fanno la differenza.",
    "Usciti dal locale con il sorriso e la pancia piena!"

    ]
    neutre = [
        "Tutto sommato bene, ma mi aspettavo di più dalle recensioni.",
    "Cibo nella media, nulla di eccezionale ma commestibile.",
    "Buono, ma il servizio è stato decisamente troppo lento.",
    "Prezzi leggermente alti per quello che abbiamo mangiato.",
    "Senza infamia e senza lode, un ristorante come tanti.",
    "Posto carino, peccato che i piatti fossero un po' freddi.",
    "La pizza era buona, ma il dolce mi ha deluso.",
    "Personale gentile, ma c'è molta disorganizzazione in sala.",
    "Non male per una pausa pranzo veloce, ma non per una cena speciale.",
    "Porzioni un po' scarse rispetto al prezzo pagato.",
    "Il locale è molto rumoroso, faticavamo a parlarci.",
    "Ho mangiato bene, ma l'attesa è stata eccessiva.",
    "Menù con poca scelta, avrei gradito più varietà.",
    "La qualità è calata rispetto all'ultima volta che sono venuto.",
    "Cucina casalinga, forse un po' troppo semplice.",
    "Il primo era ottimo, il secondo lasciava a desiderare.",
    "Arredamento un po' datato, avrebbe bisogno di una svecchiata.",
    "Rapporto qualità-prezzo appena sufficiente.",
    "Si mangia abbastanza bene, ma il parcheggio è un incubo.",
    "Camerieri sbrigativi, non ci siamo sentiti molto coccolati.",
    "Un posto onesto, niente di memorabile.",
    "Il conto era giusto, ma il cibo non aveva molto sapore.",
    "Tavoli troppo vicini tra loro, poca privacy.",
    "Buona la materia prima, ma cucinata senza troppa fantasia.",
    "Esperienza altalenante: antipasto top, pasta scotta.",
    "Accettabile se non avete grandi pretese.",
    "Il vino era buono, il resto dimenticabile.",
    "Servizio cortese ma tempi biblici tra una portata e l'altra.",
    "Non so se ci tornerei, ci sono posti migliori in zona.",
    "Locale pulito, ma l'atmosfera è un po' fredda.",
    "I fritti erano pesanti, la pizza invece si salvava.",
    "Hanno sbagliato una portata, ma hanno rimediato velocemente.",
    "Classico ristorante turistico, cibo standard.",
    "Buono, ma non indimenticabile.",
    "L'ambiente è molto bello, peccato che la cucina non sia all'altezza.",
    "Ho chiesto una variazione al piatto e non sono stato accontentato.",
    "Troppa confusione nel locale, servizio andato in tilt.",
    "Il dolce era stucchevole, il resto della cena ok.",
    "Carne discreta, ma ho mangiato filetti migliori.",
    "Un po' caro per essere una trattoria alla mano.",
    "Il personale correva troppo, mettendoci ansia.",
    "Bagni non pulitissimi, sala invece ordinata.",
    "Piatti presentati bene, ma sapore un po' piatto.",
    "Va bene per una volta, non diventera il mio preferito.",
    "L'acqua costava come il vino, attenzione al conto.",
    "Non è stato un disastro, ma nemmeno un successo.",
    "La location merita 10, il cibo 5.",
    "Sufficienza piena, ma non andrei oltre.",
    "Gentili a trovarci il posto senza prenotazione, cibo ok.",
    "Esperienza nella media, né carne né pesce."]
    negative = [
        "Esperienza pessima, non ci tornerò mai più.",
    "Cibo arrivato freddo e dopo un'ora di attesa.",
    "Personale scortese e poco attento alle esigenze del cliente.",
    "Troppo caro per la scarsa qualità del cibo offerto.",
    "Il locale era sporco e i bagni in condizioni inaccettabili.",
    "Ho chiesto una bistecca ben cotta ed è arrivata praticamente cruda.",
    "Da evitare assolutamente, una trappola per turisti.",
    "Servizio disorganizzato, hanno sbagliato le ordinazioni tre volte.",
    "La pasta era scotta e il condimento sembrava in scatola.",
    "Atmosfera sgradevole e proprietario arrogante.",
    "Abbiamo aspettato 40 minuti solo per avere il menù.",
    "Il pesce aveva un odore strano, non mi sono fidato a mangiarlo.",
    "Porzioni ridicole a prezzi esorbitanti.",
    "Pizza bruciata sotto e cruda sopra, immangiabile.",
    "Il vino sapeva di tappo e non hanno voluto cambiarlo.",
    "Rumore assordante, impossibile parlare con chi si ha di fronte.",
    "Ho trovato un capello nel piatto, disgustoso.",
    "Conto salatissimo e pieno di voci extra non richieste.",
    "Camerieri che ti ignorano completamente.",
    "Qualità degna di una mensa scolastica, ma a prezzi da ristorante.",
    "Non hanno rispettato la mia allergia nonostante l'avessi segnalata.",
    "Tavoli appiccicosi e posate macchiate.",
    "Il fritto misto grondava olio, sono stato male tutta la notte.",
    "Una delusione totale su tutti i fronti.",
    "Maleducazione unica, ci hanno quasi cacciati perché chiudevano.",
    "Non accettano il bancomat nel 2024, assurdo.",
    "Il dolce era vecchio e secco.",
    "Sconsigliatissimo, soldi buttati.",
    "Hanno servito prima tavoli arrivati dopo di noi.",
    "Carne dura come una suola di scarpa.",
    "L'acqua del rubinetto fatta pagare come acqua in bottiglia.",
    "Non c'è paragone con la vecchia gestione, è peggiorato tantissimo.",
    "Odore di fritto impregnato nei vestiti appena entrati.",
    "Recensioni positive sicuramente false, la realtà è ben diversa.",
    "Servizio lentissimo, abbiamo saltato il dolce per la disperazione.",
    "Ingredienti chiaramente surgelati e spacciati per freschi.",
    "Il risotto era salatissimo, impossibile da finire.",
    "Nessuna attenzione per i bambini, non avevano nemmeno un seggiolone.",
    "Location trascurata e piena di polvere.",
    "Mi aspettavo molto meglio, sono uscito affamato e arrabbiato.",
    "Caos totale, il cameriere sudava sopra i piatti.",
    "Ho chiesto il conto tre volte prima di riceverlo.",
    "Menù unto e illeggibile.",
    "Vergognoso far pagare il coperto 3 euro per un servizio inesistente.",
    "L'antipasto era palesemente riscaldato al microonde.",
    "Non ci metterò mai più piede.",
    "Pessimo rapporto qualità-prezzo.",
    "Ci hanno fatto sedere vicino alla porta del bagno, terribile.",
    "La carbonara con la panna è un insulto alla cucina.",
    "Se potessi dare zero stelle lo farei."
    ]

    umori = positive + neutre + negative

    for _ in range(numero):
        rec = {
            "id": str(uuid.uuid4()),
            "nome": fake.first_name(),
            "cognome": fake.last_name(),
            "testoRecensione": random.choice(umori),
            "idRistorante": str(random.randint(1, 6)), 
            "gradimento": random.randint(0, 10),
            "contrasto": random.randint(0, 10)
        }
        review_list.append(rec)
        nuove.append(rec)

    # Scrivi tutto nel file
    with open('reviews.json', 'w') as file:
        json.dump(review_list, file, indent=2)

    return jsonify({"message": f"Aggiunte {numero} recensioni sintetiche", "data": nuove}), 201


if __name__ == '__main__':
    load_reviews()
    print("Server flask in esecuzione")
    app.run(debug=True)