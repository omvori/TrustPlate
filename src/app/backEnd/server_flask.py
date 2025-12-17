from flask_cors import CORS
import json
import os 
from flask import Flask, jsonify, request


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
             "testoRecensione":"servizio eccellente molto soddisfatto"}
        ])
    return jsonify(review_list)

#aggiungo recensioni
@app.route('/api/reviews',methods=['POST'])
def add_review():

    try:
        data = request.json

        nuova_recensione = {
            "nome": data.get('nome'),
            "cognome":data.get('cognome',''),
            "testoRecensione": data.get('testoRecensione'),
            "idProdotto": data.get('idProdotto','')
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
                 "testoRecensione":"Molto buona,soddisfatto"}
            ]
            with open('reviews.json','w') as file:
                json.dump(review_list,file,indent=2)
    except:
        review_list = []


if __name__ == '__main__':
    load_reviews()
    print("Server flask in esecuzione")
    app.run()