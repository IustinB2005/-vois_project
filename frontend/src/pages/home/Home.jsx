import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeView from './HomeView';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <HomeView 
      onLogout={handleLogout}
      onNavigateLobby={() => navigate('/lobby')}
      onNavigatePreferences={() => navigate('/questions')}
    />
  );
}