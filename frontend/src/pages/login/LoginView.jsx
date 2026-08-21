import React from 'react';
import './LoginView.css';

const LoginView = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  errorMessage,
  onRegisterClick
}) => {
  return (
    <div className="login-container">
      {/* Linia roșie animată care se plimbă pe fundal */}
      <div className="scan-line"></div>

      {/* Watermark mare în fundal */}
      <div className="background-watermark">CM</div>

      {/* Header cu Logo stânga și status dreapta sus */}
      <header className="login-header">
        <div className="logo">CINEMATCH</div>
        <div className="header-right-text">SIGN IN</div>
      </header>

      {/* Conținut Principal */}
      <main className="login-main">
        
        {/* Banner de eroare, afișat doar dacă există o eroare */}
        {errorMessage && (
          <div className="error-banner">
            {errorMessage}
          </div>
        )}

        <div className="form-screen-wrapper">
          
          {/* Titlul Paginii */}
          <div className="title-section">
            <h1 className="main-title">SIGN<br />IN.</h1>
            <div className="red-line"></div>
            <p className="subtitle">WELCOME BACK TO CINEMATCH</p>
          </div>

          {/* Formularul de Autentificare */}
          <form onSubmit={onSubmit} className="industrial-form">
            
            {/* Input Email */}
            <div className="input-block">
              <label htmlFor="email" className="input-tag">
                <span className="label-number">01</span> Email Address
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={onEmailChange}
                placeholder="you@example.com"
                className="industrial-input"
                required
              />
            </div>

            {/* Input Password */}
            <div className="input-block">
              <label htmlFor="password" className="input-tag">
                <span className="label-number">02</span> Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={onPasswordChange}
                placeholder="........"
                className="industrial-input"
                required
              />
            </div>

            {/* Buton Sign In */}
            <button type="submit" className="massive-black-btn">
              SIGN IN
            </button>
          </form>

          {/* Link către Înregistrare */}
          <div className="form-footer">
            No account?
            <button type="button" className="text-link" onClick={onRegisterClick}>
              Register here
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default LoginView;