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

export default function HomeView({ movies, searchQuery, onSearchChange, isLoading, error, onLogout, onNavigateLobby, onNavigatePreferences }) {

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
        
        {/* Bara de căutare sus + Butoanele */}
        <div className="search-bar-section">
          <div className="search-box-wrapper">
            <span className="search-icon"><SearchIcon /></span>
            <input 
              type="text" 
              placeholder="Search for a movie..."
              className="top-search-input"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <div className="top-action-buttons">
            <button onClick={onNavigatePreferences} className="top-btn logout-btn">
              Preferences
            </button>
            <button onClick={onNavigateLobby} className="top-btn lobby-btn">
              LOBBY
            </button>
            <button onClick={onLogout} className="top-btn logout-btn">
              <LogoutIcon /> LOGOUT
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
        {isLoading && <p className="movies-status">LOADING MOVIES...</p>}
        {!isLoading && error && <p className="movies-status movies-error">{error}</p>}
        {!isLoading && !error && movies.length === 0 && <p className="movies-status">NO MOVIES FOUND.</p>}
        {!isLoading && !error && (
          <div className="movies-grid">
            {movies.map((movie, index) => (
              <div key={movie.id} className="home-movie-card">
                <span className="movie-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="movie-poster-wrapper">
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Poster ${movie.title || movie.original_title}`} className="movie-poster" loading="lazy" />
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title || movie.original_title}</h3>
                  <p className="movie-details">{movie.release_date?.slice(0, 4) || 'YEAR N/A'} · RATING {movie.vote_average?.toFixed(1) || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}