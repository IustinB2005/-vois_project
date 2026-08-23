import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeView from './HomeView';

export default function Home() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError('');
      try {
        const params = searchQuery.trim() ? `?query=${encodeURIComponent(searchQuery.trim())}` : '';
        const response = await fetch(`http://localhost:8000/movies/recommendations${params}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        setMovies(Array.isArray(data.movies) ? data.movies : []);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Filmele nu au putut fi încărcate. Încearcă din nou.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, searchQuery ? 400 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <HomeView 
      movies={movies}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      isLoading={isLoading}
      error={error}
      onLogout={handleLogout}
      onNavigateLobby={() => navigate('/lobby')}
      onNavigatePreferences={() => navigate('/questions')}
    />
  );
}