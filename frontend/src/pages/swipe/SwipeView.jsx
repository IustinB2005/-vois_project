import React from 'react';
import TinderCard from 'react-tinder-card';
import './SwipeView.css';

const SwipeView = ({
  filme,
  totalFilme,
  childRefs,
  onSwipe,
  ultimaActiune,
  anuleazaUltimulSwipe
}) => {
  return (
    <div className="page-container">
      
      <header className="top-header">
        <div className="brand-logo">Cinematch</div>
      </header>

      <main className="main-content">
        
        {/* Watermark pe fundal exact ca la Login/Register */}
        <div className="watermark-bg">
          <span>SWIPE</span>
        </div>

        <div className="swipe-wrapper-container">
          
          <h1 className="page-title">
            Pick<br />Your Film.
          </h1>
          
          <div className="red-divider"></div>
          
          <p className="sub-title">
            {filme.length > 0 
              ? `Filme rămase: ${filme.length} din ${totalFilme}` 
              : 'Ai terminat toate filmele! 🎉'}
          </p>

          <div className="card-container">
            {filme.length > 0 ? (
              filme.map((film, index) => (
                <div key={film.id} className="swipe-card-wrapper">
                  <TinderCard
                    ref={childRefs[index]}
                    onSwipe={(dir) => onSwipe(dir, film, index)}
                    preventSwipe={['up', 'down']}
                  >
                    <div 
                      className="movie-card" 
                      style={{ backgroundImage: `url(${film.urlImagine})` }}
                    >
                      <div className="card-overlay">
                        <h3 className="card-title">{film.nume}</h3>
                      </div>
                    </div>
                  </TinderCard>
                </div>
              ))
            ) : (
              <div className="finished-card">
                <h3>Se așteaptă ceilalți din cameră...</h3>
              </div>
            )}
          </div>

          {ultimaActiune && filme.length < totalFilme && (
            <button className="rewind-btn" onClick={anuleazaUltimulSwipe}>
              ⟲ Anulare Swipe
            </button>
          )}

        </div>
      </main>
    </div>
  );
};

export default SwipeView;