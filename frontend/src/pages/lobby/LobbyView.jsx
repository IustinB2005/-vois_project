import React from 'react';
import './LobbyView.css';

/* Iconițe SVG simple în loc de emoji-uri */
const UsersIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CrownIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
  </svg>
);

export default function LobbyView({
  view,
  setView,
  joinCode,
  setJoinCode,
  roomData,
  error,
  onCreateHost,
  onJoinSubmit,
  onStartRound,
  onBackHome
}) {
  return (
    <div className="lobby-container">
      {/* Linia roșie animată care se plimbă pe fundal */}
      <div className="scan-line"></div>

      {/* Watermark dinamic în fundal în funcție de ecran */}
      <div className="background-watermark">
        {view === 'menu' && 'LOBBY'}
        {view === 'join' && 'JOIN'}
        {view === 'waiting_room' && 'WAITING'}
        {view === 'host' && 'HOST'}
      </div>

      {/* Header simplu */}
      <header className="lobby-header">
        <div className="logo">CINEMATCH</div>
        <div className="header-status">
          {view === 'menu' && 'LOBBY'}
          {view === 'join' && 'JOINING LOBBY'}
          {view === 'waiting_room' && 'WAITING FOR HOST'}
          {view === 'host' && 'HOSTING LOBBY'}
        </div>
      </header>

      <main className="lobby-main">
        {error && <div className="error-banner">{error}</div>}

        {/* 1. MENIUL PRINCIPAL (2 Carduri: Join alb & Host negru) */}
        {view === 'menu' && (
          <div className="menu-wrapper">
            <div className="title-section">
              <h1 className="main-title">LOBBY.</h1>
              <div className="red-line"></div>
              <p className="subtitle">PICK YOUR MODE</p>
            </div>

            <div className="split-cards-container">
              {/* Card Join (Alb) */}
              <div className="lobby-card white-card" onClick={() => setView('join')}>
                <div className="card-icon"><UsersIcon /></div>
                <h2>JOIN A LOBBY</h2>
                <p>ENTER A ROOM CODE</p>
              </div>

              {/* Card Host (Negru) */}
              <div className="lobby-card black-card" onClick={onCreateHost}>
                <div className="card-icon"><CrownIcon /></div>
                <h2>BE A HOST</h2>
                <p>CREATE YOUR ROOM</p>
              </div>
            </div>

            <div className="footer-nav">
              <button onClick={onBackHome} className="text-link">
                ← Back to Home
              </button>
            </div>
          </div>
        )}

        {/* 2. ECRANUL DE JOIN A ROOM */}
        {view === 'join' && (
          <div className="form-screen-wrapper">
            <div className="title-section">
              <h1 className="main-title">JOIN A<br />ROOM.</h1>
              <div className="red-line"></div>
              <p className="subtitle">ENTER THE ROOM CODE TO JOIN YOUR FRIENDS</p>
            </div>

            <form onSubmit={onJoinSubmit} className="industrial-form">
              <div className="input-block">
                <span className="input-tag">01 ROOM CODE</span>
                <input 
                  type="text" 
                  placeholder="A1B2C" 
                  value={joinCode}
                  maxLength={5}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="industrial-input"
                  required
                />
                <span className="input-hint">FORMAT: XXXXX</span>
              </div>

              <button type="submit" className="massive-black-btn">
                JOIN ROOM
              </button>
            </form>

            <div className="footer-nav">
              <button onClick={() => setView('menu')} className="text-link">
                ← Back to Lobby
              </button>
            </div>
          </div>
        )}

        {/* 3. ECRANUL DE WAITING ROOM (Pentru Invitat) */}
        {view === 'waiting_room' && roomData && (
          <div className="form-screen-wrapper">
            <div className="title-section">
              <h1 className="main-title">WAITING<br />ROOM.</h1>
              <div className="red-line"></div>
              <p className="subtitle">CONNECTED TO LOBBY</p>
            </div>

            <div className="code-display-box">
              <span className="input-tag">01 ROOM CODE</span>
              <div className="code-value">{roomData.code}</div>
            </div>

            <div className="waiting-status-box">
              <div className="pulse-dot"></div>
              <span>WAITING FOR THE HOST TO START...</span>
            </div>

            <div className="players-section">
              <span className="input-tag">02 PLAYERS IN LOBBY ({roomData.users?.length || 1})</span>
              <div className="players-table">
                {roomData.users?.map((u, i) => (
                  <div key={u.id || i} className="player-row">
                    <div className="player-avatar-box">
                      {u.username.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="player-name">{u.username}</span>
                    <span className="player-status ready">● CONNECTED</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="footer-nav">
              <button onClick={() => setView('menu')} className="text-link">
                ← Leave Lobby
              </button>
            </div>
          </div>
        )}

        {/* 4. ECRANUL DE HOST */}
        {view === 'host' && roomData && (
          <div className="form-screen-wrapper">
            <div className="title-section">
              <h1 className="main-title">HOST.</h1>
              <div className="red-line"></div>
              <p className="subtitle">SHARE YOUR ROOM CODE WITH FRIENDS</p>
            </div>

            <div className="code-display-box bordered-box">
              <span className="input-tag">01 ROOM CODE</span>
              <div className="code-value">{roomData.code}</div>
              <button 
                onClick={() => navigator.clipboard.writeText(roomData.code)} 
                className="copy-code-btn"
              >
                COPY CODE
              </button>
            </div>

            <div className="players-section">
              <span className="input-tag">02 PLAYERS IN LOBBY ({roomData.users?.length || 1})</span>
              <div className="players-table">
                {roomData.users?.map((u, i) => (
                  <div key={u.id || i} className="player-row">
                    <div className="player-avatar-box">
                      {u.username.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="player-name">{u.username}</span>
                    <span className="player-status ready">● READY</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={onStartRound} className="massive-black-btn">
              START MOVIE NIGHT
            </button>

            <div className="footer-nav">
              <button onClick={() => setView('menu')} className="text-link">
                ← Back to Lobby
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}