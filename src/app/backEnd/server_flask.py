from flask_cors import CORS
import json
import os 
from flask import Flask, jsonify, request
import uuid


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



if __name__ == '__main__':
    load_reviews()
    print("Server flask in esecuzione")
    app.run(debug=True)