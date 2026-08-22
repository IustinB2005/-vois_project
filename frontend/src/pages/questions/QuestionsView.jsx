import React from 'react';
import './QuestionsView.css';

export default function QuestionsView({
  step,
  decades,
  genres,
  selectedDecades,
  selectedGenres,
  onToggleDecade,
  onToggleGenre,
  onNextStep,
  onPrevStep,
  onSubmit,
  errorMessage
}) {
  return (
    <div className="questions-page-container">
      {/* Linie roșie animată de scanare */}
      <div className="scan-line"></div>

      {/* Watermark de fundal */}
      <div className="background-watermark">
        {step === 1 ? 'ERA' : 'GENRE'}
      </div>

      {/* Header sus */}
      <header className="questions-header">
        <div className="logo">CINEMATCH</div>
        <div className="header-step-indicator">
          {step === 1 ? 'SELECT ERA' : 'SELECT GENRES'}
        </div>
      </header>

      {/* Conținut Central */}
      <main className="questions-main">
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* PASUL 1: ERA */}
        {step === 1 && (
          <form onSubmit={onNextStep}>
            <div className="title-section">
              <h1 className="main-title">YOUR<br />ERA.</h1>
              <div className="red-accent-line"></div>
              <p className="subtitle">WHAT PERIODS WOULD YOU LIKE?</p>
              <span className="sub-hint">SELECT ALL THAT APPLY</span>
            </div>

            <div className="options-list-single">
              {decades.map((decade, index) => {
                const isSelected = selectedDecades.includes(decade);
                const numStr = index < 9 ? `0${index + 1}` : `${index + 1}`;
                return (
                  <div 
                    key={decade} 
                    className={`option-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => onToggleDecade(decade)}
                  >
                    <span className="row-number">{numStr}</span>
                    <div className="checkbox-box">
                      {isSelected && <div className="checkbox-tick"></div>}
                    </div>
                    <span className="row-label">{decade}</span>
                  </div>
                );
              })}
            </div>

            <div className="counter-text">
              {selectedDecades.length} {selectedDecades.length === 1 ? 'ERA SELECTED' : 'ERAS SELECTED'}
            </div>

            <div className="button-container">
              <button type="submit" className="action-main-btn">
                CONTINUE
              </button>
            </div>
          </form>
        )}

        {/* PASUL 2: VIBE / GENRES */}
        {step === 2 && (
          <form onSubmit={onSubmit}>
            <div className="title-section">
              <h1 className="main-title">YOUR<br />VIBE.</h1>
              <div className="red-accent-line"></div>
              <p className="subtitle">WHAT GENRES WOULD YOU LIKE TO SEE TODAY?</p>
              <span className="sub-hint">SELECT ALL THAT APPLY</span>
            </div>

            <div className="options-grid-double">
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <div 
                    key={genre} 
                    className={`option-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => onToggleGenre(genre)}
                  >
                    <div className="checkbox-box">
                      {isSelected && <div className="checkbox-tick"></div>}
                    </div>
                    <span className="row-label">{genre}</span>
                  </div>
                );
              })}
            </div>

            <div className="counter-text">
              {selectedGenres.length} {selectedGenres.length === 1 ? 'GENRE SELECTED' : 'GENRES SELECTED'}
            </div>

            <div className="button-container double-buttons">
              <button type="button" className="action-secondary-btn" onClick={onPrevStep}>
                BACK
              </button>
              <button type="submit" className="action-main-btn">
                FIND MY MOVIES
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}