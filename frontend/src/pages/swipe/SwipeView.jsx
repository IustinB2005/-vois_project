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
      
      <header className="top-header">
        <div className="brand-logo">Cinematch</div>
      </header>

      <main className="main-content">
        
        <div className="watermark-bg">
          <span>SWIPE</span>
        </div>

        <div className="swipe-wrapper-container">
          
          <h1 className="page-title">
            Pick<br />Your Film.
          </h1>
          
          <div className="red-divider"></div>
          
          <p className="sub-title">
            {movies.length > 0 
              ? `Movies remaining: ${movies.length} of ${totalMovies}` 
              : 'Waiting for other room members...'}
          </p>

          <div className="card-container">
            {movies.length > 0 ? (
              movies.map((movie, index) => (
                <div key={movie.id} className="swipe-card-wrapper">
                  <TinderCard
                    ref={childRefs[index]}
                    onSwipe={(direction) => onSwipe(direction, movie, index)}
                    preventSwipe={['up', 'down']}
                  >
                    <div 
                      className="movie-card" 
                      style={{ backgroundImage: `url(${movie.urlImagine || movie.poster_url})` }}
                    >
                      <div className="card-overlay">
                        <h3 className="card-title">{movie.nume || movie.title}</h3>
                      </div>
                    </div>
                  </TinderCard>
                </div>
              ))
            ) : (
              <div className="finished-card">
                <h3>Syncing results with the lobby...</h3>
              </div>
            )}
          </div>

          {lastAction && movies.length < totalMovies && (
            <button className="rewind-btn" onClick={handleRewind}>
              ⟲ Rewind Swipe
            </button>
          )}

        </div>
      </main>
    </div>
  );
};

export default SwipeView;