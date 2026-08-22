import React from 'react';
import TinderCard from 'react-tinder-card';
import './SwipeView.css';

const SwipeView = ({
  movies,
  totalMovies,
  childRefs,
  onSwipe,
  lastAction,
  handleRewind
}) => {
  return (
    <div className="page-container">
      
      {/* Linia roșie animată pe fundal */}
      <div className="scan-line"></div>

      {/* Watermark mare în fundal și indicatorii X / ✔ */}
      <div className="background-watermark">SWIPE</div>
      <div className="swipe-indicator-left">✕</div>
      <div className="swipe-indicator-right">✔</div>

      <header className="top-header">
        <div className="brand-logo">CINEMATCH</div>
        <div className="header-right-text" style={{ fontFamily: 'Teko, sans-serif', fontSize: '16px', fontWeight: 800, letterSpacing: '2px', color: '#777', textTransform: 'uppercase' }}>
          CHOOSING MOVIE
        </div>
      </header>

      <main className="main-content">
        <div className="swipe-wrapper-container">
          
          <h1 className="page-title">
            PICK<br />YOUR FILM.
          </h1>
          
          <div className="red-divider"></div>
          
          <p className="sub-title">
            {movies.length > 0 
              ? `MOVIES REMAINING: ${movies.length} OF ${totalMovies}` 
              : 'WAITING FOR OTHER ROOM MEMBERS...'}
          </p>

          <div className="card-container">
            {movies.length > 0 ? (
              movies.map((movie, index) => (
                <TinderCard
                  key={movie.id}
                  className="swipe-card-wrapper"
                  ref={childRefs[index]}
                  onSwipe={(direction) => onSwipe(direction, movie, index)}
                  preventSwipe={['up', 'down']}
                  swipeRequirementType="position"
                  swipeThreshold={100}
                >
                  <div 
                    className="movie-card" 
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` }}
                  >
                    <div className="card-overlay">
                      <h3 className="card-title">{movie.nume || movie.title}</h3>
                    </div>
                  </div>
                </TinderCard>
              ))
            ) : (
              <div className="finished-card">
                <h3>SYNCING RESULTS WITH THE LOBBY...</h3>
              </div>
            )}
          </div>

          {lastAction && movies.length < totalMovies && (
            <button className="rewind-btn" onClick={handleRewind}>
              ⟲ REWIND SWIPE
            </button>
          )}

        </div>
      </main>
    </div>
  );
};

export default SwipeView;