import requests
import pandas as pd
import time
import os

# Configuration de l'API TMDB
TMDB_API_KEY = 'dc3f7b6a71f68a554fb0451e4d922425'  # Remplacez par votre clé API
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

def get_popular_movies(page=1):
    """Récupère les films populaires depuis l'API TMDB"""
    url = f"{TMDB_BASE_URL}/movie/popular"
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'fr-FR',
        'page': page
    }
    response = requests.get(url, params=params)
    return response.json()['results']

def get_movies_by_category(category, page=1):
    """Récupère les films par catégorie depuis l'API TMDB"""
    url = f"{TMDB_BASE_URL}/movie/{category}"
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'fr-FR',
        'page': page
    }
    response = requests.get(url, params=params)
    return response.json()['results']

def get_movies_by_genre(genre_id, page=1):
    """Récupère les films par genre depuis l'API TMDB"""
    url = f"{TMDB_BASE_URL}/discover/movie"
    params = {
        'api_key': TMDB_API_KEY,
        'language': 'fr-FR',
        'page': page,
        'with_genres': genre_id,
        'sort_by': 'popularity.desc'
    }
    response = requests.get(url, params=params)
    return response.json()['results']

def format_movie_data(movie):
    """Formate les données d'un film pour le CSV"""
    return {
        'title': movie['title'],
        'overview': movie['overview'],
        'release_date': movie['release_date'],
        'poster_url': f"https://image.tmdb.org/t/p/w500{movie['poster_path']}" if movie['poster_path'] else '',
        'backdrop_url': f"https://image.tmdb.org/t/p/original{movie['backdrop_path']}" if movie['backdrop_path'] else '',
        'vote_average': movie['vote_average'],
        'tmdb_id': movie['id']
    }

def add_movies_to_csv():
    """Ajoute de nouveaux films au CSV"""
    print("Début de l'ajout de nouveaux films...")
    
    # Charger le CSV existant
    if os.path.exists('movies.csv'):
        existing_movies = pd.read_csv('movies.csv')
        print(f"Nombre de films existants: {len(existing_movies)}")
        
        # Extraire les IDs TMDB des URLs de poster si la colonne n'existe pas
        if 'tmdb_id' not in existing_movies.columns:
            print("Extraction des IDs TMDB depuis les URLs de poster...")
            existing_movies['tmdb_id'] = existing_movies['poster_url'].str.extract(r'/(\d+)\.jpg')
            existing_movies['tmdb_id'] = pd.to_numeric(existing_movies['tmdb_id'], errors='coerce')
        
        existing_tmdb_ids = set(existing_movies['tmdb_id'].dropna().astype(int))
    else:
        existing_movies = pd.DataFrame()
        existing_tmdb_ids = set()
        print("Aucun fichier CSV existant, création d'un nouveau fichier")

    # Catégories et genres de films à récupérer
    categories = ['popular', 'top_rated', 'now_playing']
    genres = {
        'Action': 28,
        'Aventure': 12,
        'Animation': 16,
        'Comédie': 35,
        'Crime': 80,
        'Documentaire': 99,
        'Drame': 18,
        'Familial': 10751,
        'Fantastique': 14,
        'Histoire': 36,
        'Horreur': 27,
        'Musique': 10402,
        'Mystère': 9648,
        'Romance': 10749,
        'Science-Fiction': 878,
        'Téléfilm': 10770,
        'Thriller': 53,
        'Guerre': 10752,
        'Western': 37
    }
    
    # Récupérer les nouveaux films
    new_movies = []
    
    # Récupérer par catégories
    for category in categories:
        print(f"\nRécupération des films {category}...")
        for page in range(1, 6):  # 5 pages par catégorie
            print(f"Récupération de la page {page}...")
            movies = get_movies_by_category(category, page)
            
            for movie in movies:
                if movie['id'] not in existing_tmdb_ids:
                    new_movies.append(format_movie_data(movie))
                    print(f"✅ Nouveau film ajouté: {movie['title']}")
            
            time.sleep(1)
    
    # Récupérer par genres
    for genre_name, genre_id in genres.items():
        print(f"\nRécupération des films {genre_name}...")
        for page in range(1, 4):  # 3 pages par genre
            print(f"Récupération de la page {page}...")
            movies = get_movies_by_genre(genre_id, page)
            
            for movie in movies:
                if movie['id'] not in existing_tmdb_ids:
                    new_movies.append(format_movie_data(movie))
                    print(f"✅ Nouveau film ajouté: {movie['title']}")
            
            time.sleep(1)

    if new_movies:
        # Créer un DataFrame avec les nouveaux films
        new_movies_df = pd.DataFrame(new_movies)
        
        # Combiner avec les films existants
        if not existing_movies.empty:
            combined_movies = pd.concat([existing_movies, new_movies_df], ignore_index=True)
        else:
            combined_movies = new_movies_df
        
        # Sauvegarder le CSV
        combined_movies.to_csv('movies.csv', index=False)
        print(f"\n✅ {len(new_movies)} nouveaux films ajoutés")
        print(f"✅ Total des films dans le CSV: {len(combined_movies)}")
    else:
        print("\nAucun nouveau film à ajouter")

if __name__ == "__main__":
    add_movies_to_csv() 