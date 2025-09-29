import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/UserContext';
import StarRatings from 'react-star-ratings';

function Recommendation() {
  const { User } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!User) {
          setError('Veuillez vous connecter pour voir vos recommandations');
          setLoading(false);
          return;
        }

        console.log("Email de l'utilisateur connecté:", User.email);
        
        // Vérifier si le serveur est accessible
        try {
          await axios.get('http://localhost:5000/');
        } catch (err) {
          setError('Le serveur de recommandations n\'est pas accessible. Veuillez vérifier qu\'il est en cours d\'exécution.');
          setLoading(false);
          return;
        }

        const res = await axios.post('http://localhost:5000/api/recommendations', {
          email: User.email,
        });

        console.log("Réponse du serveur:", res.data);

        if (res.data.error) {
          setError(res.data.error);
        } else if (res.data.recommendations && res.data.status === 'success') {
          console.log("Nombre de recommandations reçues:", res.data.recommendations.length);
          const validRecommendations = res.data.recommendations.filter(movie => 
            movie && 
            movie.title && 
            movie.poster_path && 
            movie.release_date
          );
          console.log("Nombre de recommandations valides:", validRecommendations.length);
          
          if (validRecommendations.length === 0) {
            setError('Aucune recommandation valide trouvée');
          } else {
            setRecommendations(validRecommendations);
          }
        } else {
          setError('Format de réponse invalide du serveur');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des recommandations:", err);
        if (err.response) {
          setError(err.response.data.error || 'Erreur lors de la récupération des recommandations');
        } else if (err.request) {
          setError('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.');
        } else {
          setError('Une erreur est survenue lors de la récupération des recommandations');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [User]);

  const handleLogout = () => {
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-red-800 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin-slow"></div>
          </div>
        </div>
        <p className="mt-4 text-white text-lg animate-pulse">Chargement des recommandations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        {!User && (
          <Link to="/signin" className="text-white bg-red-800 px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300">
            Se connecter
          </Link>
        )}
        {User && (
          <div className="flex flex-col items-center gap-4">
            {error.includes('compte n\'est pas reconnu') ? (
              <button 
                onClick={handleLogout}
                className="text-white bg-red-800 px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
              >
                Se déconnecter
              </button>
            ) : (
              <button 
                onClick={() => window.location.reload()} 
                className="text-white bg-red-800 px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
              >
                Réessayer
              </button>
            )}
            <p className="text-gray-400 text-sm">
              Si le problème persiste, assurez-vous que le serveur de recommandations est en cours d'exécution.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-white text-xl mb-4">Aucune recommandation disponible pour le moment.</p>
        <p className="text-gray-400">Ajoutez des films à vos favoris pour recevoir des recommandations personnalisées.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-14">
      <h1 className="text-white text-4xl font-semibold mb-10 border-l-4 border-red-800 pl-3">
        Vos Recommandations
      </h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {recommendations.map((movie, index) => (
          <div key={index} className="max-w-sm shadow mb-4">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="cursor-pointer w-full h-48 object-cover"
              onClick={() => navigate(`/play/${movie.id}`)}
            />
            <div className="p-1">
              <h5 className="mt-1 mb-2 text-xl sm:text-2xl font-bold tracking-tight text-white">
                {movie.title}
              </h5>
              <div className="flex justify-between items-center text-white mb-1">
                <div className="flex items-center">
                  <div className="flex sm:flex-col">
                    <h1 className="text-green-500 text-xs lg:text-base">
                      {Math.floor(Math.random() * (100 - 60 + 1) + 60)}% match
                    </h1>
                    <h1 className="text-xs lg:text-base ml-2 sm:ml-0">
                      {movie.release_date?.split('-')[0] || 'N/A'}
                    </h1>
                  </div>
                  <h1 className="hidden sm:grid py-1 px-2 border-2 border-gray-800 rounded-md ml-2">
                    HD
                  </h1>
                </div>
                <div>
                  <StarRatings
                    rating={movie.vote_average / 2}
                    starRatedColor="red"
                    numberOfStars={5}
                    name="rating"
                    starDimension="1.2rem"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendation;
