import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { AuthContext } from '../Context/UserContext';

function Top10() {
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { User } = useContext(AuthContext);

  useEffect(() => {
    const fetchTop10 = async () => {
      if (!User) {
        setError('Veuillez vous connecter pour voir le Top 10');
        setLoading(false);
        return;
      }

      try {
        console.log("Début de la récupération du Top 10...");
        const res = await axios.get('http://localhost:5000/api/top10');
        console.log("Réponse complète du serveur:", res);
        
        if (res.data.error) {
          console.error("Erreur du serveur:", res.data.error);
          setError(res.data.error);
        } else if (res.data.top10) {
          console.log("Top 10 reçu:", res.data.top10);
          setTopMovies(res.data.top10);
        } else {
          console.error("Format de réponse invalide:", res.data);
          setError('Format de réponse invalide du serveur');
        }
      } catch (err) {
        console.error("Erreur détaillée:", err);
        if (err.response) {
          console.error("Réponse d'erreur:", err.response.data);
          setError(err.response.data.error || 'Erreur lors de la récupération du Top 10');
        } else if (err.request) {
          console.error("Pas de réponse du serveur");
          setError('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.');
        } else {
          console.error("Erreur inattendue:", err.message);
          setError('Une erreur est survenue lors de la récupération du Top 10');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTop10();
  }, [User]);

  if (!User) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-white text-xl mb-4">Veuillez vous connecter pour voir le Top 10</p>
        <button 
          onClick={() => navigate('/login')} 
          className="text-white bg-red-800 px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
        >
          Se connecter
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-red-800 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin-slow"></div>
          </div>
        </div>
        <p className="mt-4 text-white text-lg animate-pulse">Chargement du Top 10...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-white bg-red-800 px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-14">
      <h1 className="text-white text-4xl font-semibold my-10 border-l-4 border-red-800 pl-3">
        Top 10 des Films les Plus Populaires
      </h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {topMovies.map((movie, index) => (
          <div key={movie.id} className="max-w-sm shadow mb-4">
            <div className="relative">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="cursor-pointer w-full h-48 object-cover"
                onClick={() => navigate(`/play/${movie.id}`)}
              />
              <div className="absolute top-2 left-2 bg-red-800 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
                {index + 1}
              </div>
            </div>
            <div className="p-1">
              <h5 className="mt-1 mb-2 text-xl sm:text-2xl font-bold tracking-tight text-white">
                {movie.title}
              </h5>
              <div className="flex flex-col text-white mb-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex flex-col">
                      <span className="text-green-500 text-sm">
                        {movie.view_count} vues
                      </span>
                      <span className="text-xs text-gray-400">
                        Dernière vue: {new Date(movie.last_viewed).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="hidden sm:grid py-1 px-2 border-2 border-gray-800 rounded-md ml-2">
                      HD
                    </span>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top10; 