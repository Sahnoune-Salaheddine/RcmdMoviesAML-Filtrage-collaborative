import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Initialisation de Firebase
cred = credentials.Certificate('Key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_liked_movies(uid):
    liked_movies_ref = db.collection('LikedMovies').document(uid).get()
    if liked_movies_ref.exists:
        liked_movies = liked_movies_ref.to_dict().get('movies', [])
        return liked_movies
    else:
        return []

def load_movies_from_csv(csv_file):
    print("Chargement des films depuis le CSV...")
    try:
        movies_df = pd.read_csv('movies.csv')
        print(f"Fichier CSV chargé avec succès. Nombre de lignes: {len(movies_df)}")
    except Exception as e:
        print(f"Erreur lors du chargement du CSV: {str(e)}")
        raise
    
    # Remplacer les valeurs manquantes par la moyenne
    movies_df['vote_average'] = movies_df['vote_average'].fillna(movies_df['vote_average'].mean())
    
    # Extraire l'ID TMDB de l'URL du poster
    movies_df['tmdb_id'] = movies_df['poster_url'].str.extract(r'/(\d+)\.jpg')
    movies_df['tmdb_id'] = pd.to_numeric(movies_df['tmdb_id'], errors='coerce')
    
    # Convertir les dates et filtrer les films à venir
    movies_df['release_date'] = pd.to_datetime(movies_df['release_date'], errors='coerce')
    current_date = pd.Timestamp.now()
    movies_df = movies_df[movies_df['release_date'] <= current_date]
    
    # Supprimer les lignes avec des dates invalides
    movies_df = movies_df.dropna(subset=['release_date'])
    
    print(f"Nombre total de films chargés après filtrage: {len(movies_df)}")
    return movies_df

def calculate_similarity(movies_df):
    print("Calcul de la similarité entre les films...")
    # Créer une matrice de caractéristiques
    features = movies_df[['vote_average']].copy()
    
    # Normaliser les notes entre 0 et 1
    features['vote_average'] = (features['vote_average'] - features['vote_average'].min()) / (features['vote_average'].max() - features['vote_average'].min())
    
    # Calculer la similarité cosinus
    cosine_sim = cosine_similarity(features)
    return cosine_sim

def find_movie_index(movies_df, title):
    """Trouve l'index d'un film dans le DataFrame"""
    for idx, row in movies_df.iterrows():
        if str(row['title']).lower().strip() == str(title).lower().strip():
            return idx
    return None

def recommend_movies(user_liked_movies, movies_df, cosine_sim):
    print("\nAnalyse des films aimés par l'utilisateur...")
    recommended_movies = []
    seen_indices = set()
    
    # Calculer la note moyenne des films aimés
    total_rating = 0
    count = 0
    for movie in user_liked_movies:
        if movie.get('vote_average'):
            total_rating += movie['vote_average']
            count += 1
    
    if count > 0:
        avg_rating = total_rating / count
        print(f"Note moyenne des films aimés: {avg_rating:.2f}")
    else:
        avg_rating = 6.0  # Note par défaut si aucune note n'est disponible
        print("Aucune note disponible, utilisation de la note par défaut: 6.0")
    
    # Trouver les indices des films aimés dans le CSV
    found_movies = []
    for movie in user_liked_movies:
        title = movie.get('title', 'Titre non disponible')
        tmdb_id = movie.get('id')
        print(f"Recherche du film: {title} (ID TMDB: {tmdb_id})")
        
        # Essayer d'abord de trouver par ID TMDB
        idx = None
        if tmdb_id:
            try:
                matching_rows = movies_df[movies_df['tmdb_id'] == int(tmdb_id)]
                if not matching_rows.empty:
                    idx = matching_rows.index[0]
                    print(f"✅ Film trouvé par ID TMDB: {title}")
            except (ValueError, TypeError):
                print(f"❌ ID TMDB invalide: {tmdb_id}")
        
        # Si non trouvé par ID, essayer par titre
        if idx is None:
            idx = find_movie_index(movies_df, title)
            if idx is not None:
                print(f"✅ Film trouvé par titre: {title}")
            
        if idx is not None:
            print(f"✅ Film trouvé dans le CSV: {title} (Note: {movies_df.iloc[idx]['vote_average']})")
            found_movies.append(idx)
        else:
            print(f"❌ Film non trouvé dans le CSV: {title}")
    
    print(f"\nNombre de films trouvés dans le CSV: {len(found_movies)}")
    
    # Si aucun film n'est trouvé dans le CSV, utiliser la note moyenne pour trouver des films similaires
    if not found_movies:
        print("Aucun film aimé trouvé dans le CSV, recherche basée sur la note moyenne...")
        # Trouver les films les plus proches de la note moyenne
        movies_df['rating_diff'] = abs(movies_df['vote_average'] - avg_rating)
        closest_movies = movies_df.nsmallest(10, 'rating_diff').index
        found_movies = closest_movies.tolist()
        print(f"Films trouvés avec des notes similaires à {avg_rating:.2f}")
    
    # Générer les recommandations basées sur les films trouvés
    for idx in found_movies:
        seen_indices.add(idx)
        
        # Obtenir les films similaires
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Prendre les 20 films les plus similaires avec une note minimale
        for movie_idx, score in sim_scores[1:21]:
            if (movie_idx not in seen_indices and 
                movies_df.iloc[movie_idx]['vote_average'] >= 5.0):  # Note minimale réduite à 5.0
                seen_indices.add(movie_idx)
                recommended_movies.append(movie_idx)
                print(f"✅ Film similaire trouvé: {movies_df.iloc[movie_idx]['title']} (Note: {movies_df.iloc[movie_idx]['vote_average']}, Score: {score:.2f})")
    
    print(f"\nNombre de recommandations après similarité: {len(recommended_movies)}")
    
    # Si nous n'avons pas assez de recommandations, ajouter des films similaires basés sur la note moyenne
    if len(recommended_movies) < 20:
        print(f"\nNombre de recommandations insuffisant ({len(recommended_movies)}), ajout de films supplémentaires...")
        movies_df['rating_diff'] = abs(movies_df['vote_average'] - avg_rating)
        additional_movies = movies_df[
            (movies_df['vote_average'] >= 5.0) &  # Note minimale réduite à 5.0
            (~movies_df.index.isin(seen_indices))
        ].nsmallest(20 - len(recommended_movies), 'rating_diff').index
        
        for movie_idx in additional_movies:
            if movie_idx not in seen_indices:
                seen_indices.add(movie_idx)
                recommended_movies.append(movie_idx)
                print(f"✅ Film supplémentaire trouvé: {movies_df.iloc[movie_idx]['title']} (Note: {movies_df.iloc[movie_idx]['vote_average']})")
    
    print(f"\nNombre total de recommandations: {len(recommended_movies)}")
    return recommended_movies

def get_recommendations_for_user(user_email):
    print(f"\nRecherche de l'utilisateur: {user_email}")
    try:
        users_ref = db.collection('Users')
        user_doc = None
        
        # Rechercher l'utilisateur en ignorant la casse
        all_users = users_ref.stream()
        for doc in all_users:
            user_data = doc.to_dict()
            if user_data.get('email', '').lower() == user_email.lower():
                user_doc = doc
                break
                
        if not user_doc:
            print("Utilisateur non trouvé")
            return {'error': 'Utilisateur non trouvé'}

        user_uid = user_doc.id
        print(f"Utilisateur trouvé avec l'ID: {user_uid}")
        
        user_liked_movies = get_liked_movies(user_uid)
        if not user_liked_movies:
            print("Aucun film aimé trouvé")
            return {'error': 'Aucun film aimé trouvé'}

        print(f"Nombre de films aimés trouvés: {len(user_liked_movies)}")
        
        # Charger les films depuis le CSV
        movies_df = load_movies_from_csv('movies.csv')
        
        # Calculer la similarité
        cosine_sim = calculate_similarity(movies_df)
        
        # Générer les recommandations
        recommended_indices = recommend_movies(user_liked_movies, movies_df, cosine_sim)
        
        if not recommended_indices:
            print("Aucune recommandation trouvée")
            return {'error': 'Aucune recommandation trouvée'}

        # Formater les recommandations
        recommended_movies = []
        for idx in recommended_indices:
            movie = movies_df.iloc[idx]
            try:
                # Vérifier les valeurs essentielles avant de créer l'objet
                if pd.isna(movie['title']) or pd.isna(movie['overview']):
                    print(f"Film ignoré: titre ou description manquant")
                    continue

                movie_data = {
                    'title': str(movie['title']),
                    'overview': str(movie['overview']),
                    'poster_path': str(movie.get('poster_url', '')),
                    'backdrop_path': str(movie.get('backdrop_url', '')),
                    'vote_average': float(movie.get('vote_average', 0)),
                    'release_date': movie['release_date'].strftime('%Y-%m-%d') if pd.notnull(movie['release_date']) else '2024-01-01',
                    'id': int(movie['tmdb_id']) if pd.notnull(movie['tmdb_id']) else 0
                }
                
                # Vérifier uniquement les champs essentiels
                if movie_data['title'] and movie_data['overview']:
                    recommended_movies.append(movie_data)
                    print(f"Film ajouté: {movie_data['title']}")
                else:
                    print(f"Film ignoré: données incomplètes")
            except Exception as e:
                print(f"Erreur lors du formatage du film {movie['title']}: {str(e)}")
                continue

        if not recommended_movies:
            print("Aucune recommandation valide générée")
            return {'error': 'Aucune recommandation valide générée'}

        print(f"Retour de {len(recommended_movies)} recommandations")
        return {
            'recommendations': recommended_movies,
            'status': 'success'
        }
    except Exception as e:
        print(f"Erreur lors de la génération des recommandations: {str(e)}")
        return {'error': f'Erreur lors de la génération des recommandations: {str(e)}'} 