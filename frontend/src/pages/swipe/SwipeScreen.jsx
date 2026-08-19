import { useState, useMemo, createRef, useEffect } from 'react';
import SwipeView from './SwipeView';

const mockMovies = [
  { id: 101, title: 'Interstellar', poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MvrIdZ2O.jpg' },
  { id: 102, title: 'Inception', poster_url: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
  { id: 103, title: 'The Dark Knight', poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' }
];

export default function SwipeScreen() {
  const [movies, setMovies] = useState(mockMovies);
  const [lastAction, setLastAction] = useState(null);
  const totalMovies = mockMovies.length;

  // FETCH INTEGRATION: 
  // Once your backend colleagues provide the movie recommendation route (e.g., /api/lobby/movies), 
  // uncomment the block below to fetch real data bound to the user's token and lobby.
  /*
  useEffect(() => {
    fetch('http://localhost:8000/lobby/movies', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((err) => console.error("Error fetching lobby movies:", err));
  }, []);
  */

  const childRefs = useMemo(
    () => movies.map(() => createRef()),
    [movies]
  );

  const handleSwipe = async (direction, movie, index) => {
    setLastAction({ movie, index });
    
    const voteData = {
      movieId: movie.id,
      vote: direction === 'right' ? 'like' : 'pass'
    };

    console.log(`Vote registered: ${voteData.vote} for ${movie.title || movie.nume}`);

    // SEND VOTE TO BACKEND:
    /*
    try {
      await fetch('http://localhost:8000/lobby/vote', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(voteData)
      });
    } catch (error) {
      console.error("Failed to submit vote:", error);
    }
    */

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