import React, { useState, useMemo, createRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SwipeView from './SwipeView';

export default function SwipeScreen() {
  const [movies, setMovies] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [totalMovies, setTotalMovies] = useState(0);
  const [match, setMatch] = useState(null); 
  const [allMoviesCache, setAllMoviesCache] = useState({}); 

  const location = useLocation();
  const navigate = useNavigate();
  const lobbyCode = location.state?.lobbyCode || "1234"; 

  useEffect(() => {
    fetch(`http://localhost:8000/lobby/${lobbyCode}/movies`, {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Eroare server: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.movies)) {
          setMovies(data.movies);
          setTotalMovies(data.movies.length);
          const cache = {};
          data.movies.forEach(m => cache[m.id] = m);
          setAllMoviesCache(cache);
        }
      })
      .catch((err) => console.error("Error fetching lobby movies:", err));
  }, [lobbyCode]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (match) return;

      try {
        const res = await fetch(`http://localhost:8000/lobby/${lobbyCode}/match`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        });
        const data = await res.json();
        
        if (data.status === "perfect_match") {
          const winningMovie = allMoviesCache[data.movie_id] || allMoviesCache[String(data.movie_id)];
          if (winningMovie) {
            setMatch(winningMovie);
          }
        }
      } catch (err) {
        console.error("Eroare polling match:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lobbyCode, match, allMoviesCache]);

  const childRefs = useMemo(
    () => movies.map(() => createRef()),
    [movies]
  );

  const handleSwipe = async (direction, movie, index) => {
    setLastAction({ movie, index });
    
    setTimeout(() => {
      setMovies((prevMovies) => prevMovies.filter((m) => m.id !== movie.id));
    }, 300);

    const voteData = {
      movie_id: movie.id,
      is_like: direction === 'right' 
    };

    try {
      const response = await fetch(`http://localhost:8000/lobby/${lobbyCode}/swipe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(voteData)
      });

      const result = await response.json();

      if (result.status === "perfect_match") {
        setMatch(movie);
        return; 
      }
    } catch (error) {
      console.error("Eroare la trimiterea votului:", error);
    }
  };

  const handleRewind = async () => {
    if (!lastAction) return;
    const { movie, index } = lastAction;
    
    setMovies((prev) => [movie, ...prev]);
    setLastAction(null);

    if (childRefs[index] && childRefs[index].current) {
      await childRefs[index].current.restoreCard();
    }
  };

  // ECRANUL DE MATCH REDESIGNAT ÎN STILUL INDUSTRIAL
  if (match) {
    return (
      <div className="page-container">
        <div className="scan-line"></div>
        <div className="background-watermark">MATCH</div>

        <header className="top-header">
          <div className="brand-logo">CINEMATCH</div>
          <div className="header-right-text" style={{ fontFamily: 'Teko, sans-serif', fontSize: '16px', fontWeight: 800, letterSpacing: '2px', color: '#ff4757', textTransform: 'uppercase' }}>
            IT'S A MATCH!
          </div>
        </header>

        <main className="main-content">
          <div className="swipe-wrapper-container">
            <div className="title-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '30px' }}>
              <h1 className="main-title" style={{ fontSize: '70px', lineHeight: '0.9', margin: 0 }}>IT'S A<br />MATCH!</h1>
              <div className="red-divider"></div>
              <p className="subtitle" style={{ fontFamily: 'Teko, sans-serif', fontSize: '18px', letterSpacing: '2.5px', color: '#777', fontWeight: 700, margin: 0 }}>EVERYONE WANTS TO WATCH</p>
            </div>
            
            <div className="card-container">
              <div 
                className="movie-card" 
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${match.poster_path})`, cursor: 'default' }}
              >
                <div className="card-overlay">
                  <h3 className="card-title">{match.nume || match.title}</h3>
                </div>
              </div>
            </div>

            <button className="massive-black-btn" onClick={() => navigate('/lobby')} style={{ marginTop: '30px', width: '300px' }}>
              ← BACK TO LOBBY
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <SwipeView
      movies={movies}
      totalMovies={totalMovies}
      childRefs={childRefs}
      onSwipe={handleSwipe}
      lastAction={lastAction}
      handleRewind={handleRewind}
    />
  );
}