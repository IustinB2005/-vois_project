import React from 'react';
import './HomeView.css';

export default function HomeView({ onLogout, onNavigateLobby }) {
  // Filmele recomandate cu detaliile vizibile din imagine (Titlu, An, Regizor/Detalii)
  const recommendedMovies = [
    { title: 'PARASITE', year: '2019', director: 'Bong Joon-ho', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60' },
    { title: 'DUNE', year: '2021', director: 'Denis Villeneuve', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=60' },
    { title: 'INTERSTELLAR', year: '2014', director: 'Christopher Nolan', image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=60' },
    { title: 'EVERYTHING EVERYWHERE ALL AT ONCE', year: '2022', director: 'The Daniels', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60' }
  ];
  return (
    <div className="home-container">
      {/* Watermark mare în fundal */}
      <div className="background-watermark">HOME</div>

      {/* Header cu Logo stânga și link Home dreapta sus */}
      <header className="home-header">
        <div className="logo">CINEMATCH</div>
        <div className="header-right-text">HOME</div>
      </header>

      {/* Conținut Principal */}
      <main className="home-main">
        
        {/* Bara de căutare sus + Butoanele LOGOUT și LOBBY alăturate */}
        <div className="search-bar-section">
          <div className="search-box-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search for a movie, director, actor..." 
              className="top-search-input"
            />
          </div>

          <div className="top-action-buttons">
            <button onClick={onLogout} className="top-btn logout-btn">
              ↪ LOGOUT
            </button>
            <button onClick={onNavigateLobby} className="top-btn lobby-btn">
              LOBBY
            </button>
          </div>
        </div>

        {/* Titlul paginii */}
        <div className="title-section">
          <h1 className="main-title">FOR<br />YOU.</h1>
          <div className="red-accent-line"></div>
          <p className="subtitle">BASED ON YOUR SELECTIONS</p>
        </div>

        {/* Grila de filme recomandate */}
        <div className="movies-grid">
          {recommendedMovies.map((movie, index) => (
            <div key={movie.title} className="movie-card">
              <span className="movie-index">0{index + 1}</span>
              <div className="movie-poster-wrapper">
                <img src={movie.image} alt={movie.title} className="movie-poster" />
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-details">{movie.year} · {movie.director}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}