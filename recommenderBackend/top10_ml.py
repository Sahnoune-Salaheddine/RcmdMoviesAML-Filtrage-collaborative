import pandas as pd
import numpy as np
from firebase_admin import firestore
import logging
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_all_viewed_movies():
    try:
        db = firestore.client()
        logger.info("Connexion à Firebase établie")
        
        watched_ref = db.collection('WatchedMovies')
        logger.info("Accès à la collection WatchedMovies")
        
        histories = list(watched_ref.stream())
        logger.info(f"Nombre total d'historiques trouvés: {len(histories)}")
        
        if not histories:
            logger.warning("Aucun historique trouvé dans la collection WatchedMovies")
            return {}
        
        all_movies = {}
        for history in histories:
            history_data = history.to_dict()
            logger.info(f"Traitement de l'historique de l'utilisateur {history.id}")
            logger.info(f"Données de l'historique: {history_data}")
            
            if 'movies' not in history_data:
                logger.warning(f"Pas de champ 'movies' dans l'historique de {history.id}")
                continue
                
            movies = history_data['movies']
            logger.info(f"Nombre de films trouvés: {len(movies)}")
            
            for movie in movies:
                movie_id = movie.get('id')
                if not movie_id:
                    logger.warning(f"Film sans id trouvé: {movie}")
                    continue
                if movie_id in all_movies:
                    all_movies[movie_id]['view_count'] += 1
                else:
                    all_movies[movie_id] = {
                        'view_count': 1,
                        'title': movie.get('name') or movie.get('title'),
                        'poster_url': movie.get('poster_path') or movie.get('backdrop_path'),
                        'vote_average': movie.get('vote_average', 0),
                        'release_date': movie.get('first_air_date') or movie.get('release_date'),
                        'last_viewed': datetime.now()  # Pas de timestamp, on met la date actuelle
                    }
        
        logger.info(f"Récupéré {len(all_movies)} films visionnés")
        if all_movies:
            logger.info(f"Exemple de films récupérés: {list(all_movies.items())[:2]}")
        else:
            logger.warning("Aucun film n'a été récupéré")
        return all_movies
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des films visionnés: {str(e)}")
        logger.error(f"Type d'erreur: {type(e)}")
        logger.error(f"Traceback complet: {e.__traceback__}")
        return {}

def calculate_movie_scores(all_movies):
    try:
        # Calculer les scores en tenant compte de :
        # 1. Nombre de vues (poids le plus important)
        # 2. Date de dernière vue (films récents ont un bonus)
        # 3. Note moyenne du film
        
        now = datetime.now()
        movie_scores = {}
        
        for movie_id, movie_data in all_movies.items():
            # Score de base basé sur le nombre de vues
            view_score = movie_data['view_count']
            
            # Bonus pour les vues récentes (dans les 30 derniers jours)
            days_since_last_view = (now - movie_data['last_viewed']).days
            recency_bonus = max(0, 1 - (days_since_last_view / 30))
            
            # Bonus pour la note du film
            rating_bonus = movie_data['vote_average'] / 10
            
            # Score final
            final_score = view_score * (1 + recency_bonus) * (1 + rating_bonus)
            
            movie_scores[movie_id] = {
                'score': final_score,
                'view_count': view_score,
                'last_viewed': movie_data['last_viewed'].isoformat(),
                'movie_data': movie_data
            }
        
        logger.info(f"Calculé les scores pour {len(movie_scores)} films")
        return movie_scores
    except Exception as e:
        logger.error(f"Erreur lors du calcul des scores: {str(e)}")
        return {}

def get_top10_movies():
    try:
        logger.info("Début de la génération du Top 10")
        # Récupérer tous les films visionnés
        all_movies = get_all_viewed_movies()
        if not all_movies:
            logger.error("Aucun film visionné trouvé")
            return []
        
        logger.info(f"Nombre total de films uniques: {len(all_movies)}")
        
        # Calculer les scores
        movie_scores = calculate_movie_scores(all_movies)
        if not movie_scores:
            logger.error("Aucun score calculé")
            return []
        
        logger.info(f"Nombre de scores calculés: {len(movie_scores)}")
        
        # Trier les films par score
        sorted_movies = sorted(movie_scores.items(), 
                             key=lambda x: x[1]['score'], 
                             reverse=True)
        
        logger.info(f"Nombre de films triés: {len(sorted_movies)}")
        
        # Récupérer les 10 meilleurs films
        top10_movies = []
        for movie_id, score_data in sorted_movies[:10]:
            movie_info = {
                'id': movie_id,
                'title': score_data['movie_data']['title'],
                'poster_path': score_data['movie_data']['poster_url'],
                'vote_average': score_data['movie_data']['vote_average'],
                'release_date': score_data['movie_data']['release_date'],
                'score': score_data['score'],
                'view_count': score_data['view_count'],
                'last_viewed': score_data['last_viewed']
            }
            top10_movies.append(movie_info)
            logger.info(f"Ajouté au Top 10: {movie_info}")
        
        logger.info(f"Top 10 final: {top10_movies}")
        return top10_movies
    except Exception as e:
        logger.error(f"Erreur lors de la génération du Top 10: {str(e)}")
        logger.error(f"Type d'erreur: {type(e)}")
        logger.error(f"Traceback complet: {e.__traceback__}")
        return [] 