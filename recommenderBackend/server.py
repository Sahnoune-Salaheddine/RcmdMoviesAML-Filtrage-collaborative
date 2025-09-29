import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender_csv import get_recommendations_for_user
from top10_ml import get_top10_movies
import logging
import os

# Configuration des logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialisation de Firebase
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate("Key.json")
        firebase_admin.initialize_app(cred)
        logger.info("Firebase initialisé avec succès")
    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation de Firebase: {str(e)}")
        raise

db = firestore.client()
CORS(app)

@app.route('/')
def home():
    logger.info("Requête reçue sur la route principale")
    return jsonify({
        'status': 'running',
        'message': 'Le serveur de recommandation est en cours d\'exécution',
        'endpoints': {
            '/api/recommendations': 'POST - Obtenir des recommandations de films',
            '/api/top10': 'GET - Obtenir le Top 10 basé sur le Machine Learning'
        }
    })

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.get_json()
        if not data:
            logger.error("Aucune donnée JSON reçue")
            return jsonify({'error': 'Données JSON requises'}), 400
            
        user_email = data.get('email')
        if not user_email:
            logger.error("Email manquant dans la requête")
            return jsonify({'error': 'Email requis'}), 400
            
        logger.info(f"Traitement de la requête pour l'email: {user_email}")
        
        # Vérifier si l'utilisateur existe dans Firebase
        users_ref = db.collection('Users')
        logger.info("Recherche de l'utilisateur dans la collection 'Users'")
        
        # Récupérer tous les utilisateurs et filtrer en ignorant la casse
        all_users = users_ref.stream()
        user_doc = None
        
        for doc in all_users:
            user_data = doc.to_dict()
            if user_data.get('email', '').lower() == user_email.lower():
                user_doc = doc
                break
                
        if not user_doc:
            logger.error(f"Utilisateur non trouvé: {user_email}")
            # Vérifier toutes les collections pour le débogage
            collections = db.collections()
            logger.info("Collections disponibles dans la base de données:")
            for collection in collections:
                logger.info(f"- {collection.id}")
            return jsonify({'error': 'Utilisateur non trouvé. Veuillez vérifier votre email ou vous connecter à nouveau.'}), 404
            
        user_uid = user_doc.id
        logger.info(f"Utilisateur trouvé avec l'ID: {user_uid}")
        
        # Vérifier les films aimés
        liked_movies_ref = db.collection('LikedMovies').document(user_uid).get()
        if not liked_movies_ref.exists:
            logger.error(f"Aucun film aimé trouvé pour l'utilisateur: {user_uid}")
            return jsonify({'error': 'Aucun film aimé trouvé. Veuillez ajouter des films à vos favoris.'}), 404
            
        liked_movies = liked_movies_ref.to_dict().get('movies', [])
        logger.info(f"Nombre de films aimés trouvés: {len(liked_movies)}")
        
        # Générer les recommandations
        recommendations = get_recommendations_for_user(user_email)
        
        if 'error' in recommendations:
            logger.error(f"Erreur lors de la génération des recommandations: {recommendations['error']}")
            return jsonify(recommendations), 404
            
        logger.info(f"Recommandations générées avec succès: {len(recommendations.get('recommendations', []))} films")
        return jsonify(recommendations)
        
    except Exception as e:
        logger.error(f"Erreur inattendue: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/top10', methods=['GET'])
def get_top10():
    try:
        top10_movies = get_top10_movies()
        return jsonify({'top10': top10_movies})
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du Top 10: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Démarrage du serveur de recommandation...")
    logger.info(f"Chemin du répertoire de travail: {os.getcwd()}")
    app.run(debug=True, port=5000)
