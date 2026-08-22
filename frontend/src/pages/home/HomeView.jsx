import React from 'react';
import './HomeView.css';

/* Iconițe SVG */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function HomeView({ onLogout, onNavigateLobby }) {
  const recommendedMovies = [
    { title: 'PARASITE', year: '2019', director: 'Bong Joon-ho', image: 'https://images.unsplash.com/photo-1614201842267-206a09286c3b?w=500&auto=format&fit=crop&q=60' },
    { title: 'DUNE', year: '2021', director: 'Denis Villeneuve', image: 'https://images.unsplash.com/photo-1679129396357-6b11683760bc?w=500&auto=format&fit=crop&q=60' },
    { title: 'INTERSTELLAR', year: '2014', director: 'Christopher Nolan', image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=60' },
    { title: 'EVERYTHING EVERYWHERE ALL AT ONCE', year: '2022', director: 'The Daniels', image: 'https://images.unsplash.com/photo-1603236405450-e74c465a89a8?w=500&auto=format&fit=crop&q=60' }
  ];

  return (
    <div className="home-container">
      {/* Linia roșie animată care se plimbă pe fundal */}
      <div className="scan-line"></div>

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
            <span className="search-icon"><SearchIcon /></span>
            <input 
              type="text" 
              placeholder="Search for a movie, director, actor..." 
              className="top-search-input"
            />
          </div>

          <div className="top-action-buttons">
            <button onClick={onLogout} className="top-btn logout-btn">
              <LogoutIcon /> LOGOUT
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
            <div key={movie.title} className="home-movie-card">
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