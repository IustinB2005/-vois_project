import React, { useState, useMemo, createRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SwipeView from './SwipeView';

export default function SwipeScreen() {
  const [movies, setMovies] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [totalMovies, setTotalMovies] = useState(0);

  
  const location = useLocation();
  const lobbyCode = location.state?.lobbyCode || "1234"; 

  useEffect(() => {
    fetch(`http://localhost:8000/lobby/${lobbyCode}/start`, {
      method: 'POST', 
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
        } else {
          console.error("Nu s-a gasit array-ul movies in raspuns:", data);
        }
      })
      .catch((err) => console.error("Error fetching lobby movies:", err));
  }, [lobbyCode]);

  const childRefs = useMemo(
    () => movies.map(() => createRef()),
    [movies]
  );

  const handleSwipe = async (direction, movie, index) => {
    setLastAction({ movie, index });
    
    const voteData = {
      movie_id: movie.id,
      is_like: direction === 'right' 
    };

    console.log(`Vote for ${movie.title || movie.nume}:`, voteData);

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
        alert("Avem un Perfect Match! Rata aprobare 100%");
      } else if (result.status === "partial_match") {
        console.log("Meci partial! Aprobare >= 70%");
      } else if (result.status === "waiting") {
        console.log("Vot inregistrat. Asteptam colegii...");
      }

    } catch (error) {
      console.error("Eroare la trimiterea votului:", error);
    }

    setMovies((prevMovies) => prevMovies.filter((m) => m.id !== movie.id));
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