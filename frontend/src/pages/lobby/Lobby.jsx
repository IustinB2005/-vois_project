import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LobbyView from './LobbyView';

export default function Lobby() {
  const navigate = useNavigate();
  const [view, setView] = useState('menu'); // 'menu', 'join', 'host', 'waiting_room'
  const [joinCode, setJoinCode] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState('');

  // 1. BE A HOST: Trimite request securizat cu token-ul către /lobby/create
  const handleCreateHost = async () => {
    setError('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/lobby/create', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setRoomData(data);
        setView('host');
      } else {
        setError(data.detail || 'Eroare la crearea lobby-ului');
      }
    } catch (err) {
      setError('Eroare de conexiune cu serverul.');
    }
  };

  // Verificare status pentru Host / Waiting Room
  const fetchLobbyStatus = async (code) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/lobby/${code}/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setRoomData(data);
        if (data.status === 'matching') {
          navigate('/room');
        }
      }
    } catch (err) {
      console.error("Eroare la verificarea statusului");
    }
  };

  // Polling automat la fiecare 3 secunde
  useEffect(() => {
    let interval;
    if ((view === 'host' || view === 'waiting_room') && roomData?.code) {
      interval = setInterval(() => {
        fetchLobbyStatus(roomData.code);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [view, roomData]);

  // 2. JOIN A LOBBY: Trimite codul și tokenul către /lobby/join
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/lobby/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: joinCode })
      });
      const data = await response.json();
      if (response.ok) {
        setRoomData(data);
        setView('waiting_room');
      } else {
        setError(data.detail || 'Cod invalid');
      }
    } catch (err) {
      setError('Eroare de conexiune cu serverul.');
    }
  };

  // 3. START RUNDA (Doar pentru Host)
  const handleStartRound = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/lobby/${roomData.code}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/room');
      } else {
        setError(data.detail || 'Nu se poate porni runda (ai nevoie de cel puțin 2 membri!)');
      }
    } catch (err) {
      setError('Eroare de conexiune.');
    }
  };

  return (
    <LobbyView 
      view={view}
      setView={setView}
      joinCode={joinCode}
      setJoinCode={setJoinCode}
      roomData={roomData}
      error={error}
      onCreateHost={handleCreateHost}
      onJoinSubmit={handleJoinSubmit}
      onStartRound={handleStartRound}
      onBackHome={() => navigate('/home')}
    />
  );
}