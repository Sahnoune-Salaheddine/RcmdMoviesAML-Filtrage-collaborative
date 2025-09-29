import requests
import json
import firebase_admin
from firebase_admin import credentials, firestore

# Initialisation de Firebase pour le test
cred = credentials.Certificate('Key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

def check_user_data(email):
    print("\nVérification des données Firebase:")
    users_ref = db.collection('Users')
    user_doc = users_ref.where('email', '==', email).get()
    
    if len(user_doc) == 0:
        print("❌ Utilisateur non trouvé dans Firebase")
        return None
    
    user_uid = user_doc[0].id
    print(f"✅ Utilisateur trouvé avec l'ID: {user_uid}")
    
    # Vérifier les films aimés
    liked_movies_ref = db.collection('LikedMovies').document(user_uid).get()
    if not liked_movies_ref.exists:
        print("❌ Aucun document LikedMovies trouvé pour cet utilisateur")
        return None
    
    liked_movies = liked_movies_ref.to_dict().get('movies', [])
    print(f"📽️ Nombre de films aimés: {len(liked_movies)}")
    if liked_movies:
        print("\nDétails des films aimés:")
        for movie in liked_movies:
            print(f"- Titre: {movie.get('title', 'Titre non disponible')}")
            print(f"  ID TMDB: {movie.get('id', 'ID non disponible')}")
            print(f"  Poster URL: {movie.get('poster_path', 'URL non disponible')}")
            print("  ---")
    
    return user_uid

def test_recommendations(email):
    # Vérifier d'abord les données Firebase
    user_uid = check_user_data(email)
    if not user_uid:
        return
    
    # Tester l'API
    print("\nTest de l'API:")
    url = "http://localhost:5000/api/recommendations"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "email": email
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"Erreur: {str(e)}")

if __name__ == "__main__":
    email = input("Entrez l'email de l'utilisateur à tester: ")
    test_recommendations(email) 