import React from "react";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const { id, title, poster_path } = movie;

  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <Link to={`/play/${id}`} className="transform hover:scale-105 transition-transform duration-300">
      <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-72 object-cover"
        />
        <div className="p-3">
          <h2 className="text-white text-sm font-semibold truncate">{title}</h2>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
