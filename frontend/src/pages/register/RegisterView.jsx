import React from 'react';
import './RegisterView.css';

const RegisterView = ({
  formData,
  onChange,
  onSubmit,
  errorMessage,
  onNavigateLogin
}) => {
  return (
    <div className="register-container">
      {/* Linia roșie animată care se plimbă pe fundal */}
      <div className="scan-line"></div>

      {/* Watermark mare în fundal */}
      <div className="background-watermark">JOIN</div>

      {/* Header cu Logo stânga și status dreapta sus */}
      <header className="register-header">
        <div className="logo">CINEMATCH</div>
        <div className="header-right-text">REGISTER</div>
      </header>

      {/* Conținut Principal */}
      <main className="register-main">
        
        {/* Banner de eroare, afișat doar dacă există o eroare */}
        {errorMessage && (
          <div className="error-banner">
            {errorMessage}
          </div>
        )}

        <div className="form-screen-wrapper">
          
          {/* Titlul Paginii */}
          <div className="title-section">
            <h1 className="main-title">JOIN<br />US.</h1>
            <div className="red-line"></div>
            <p className="subtitle">CREATE YOUR CINEMATCH ACCOUNT</p>
          </div>

          {/* Formularul de Înregistrare */}
          <form onSubmit={onSubmit} className="industrial-form">
            
            {/* Input Username */}
            <div className="input-block">
              <label htmlFor="username" className="input-tag">
                <span className="label-number">01</span> Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={onChange}
                placeholder="cinephile42"
                className="industrial-input"
                required
              />
            </div>

            {/* Input Email */}
            <div className="input-block">
              <label htmlFor="email" className="input-tag">
                <span className="label-number">02</span> Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="you@example.com"
                className="industrial-input"
                required
              />
            </div>

            {/* Input Password */}
            <div className="input-block">
              <label htmlFor="password" className="input-tag">
                <span className="label-number">03</span> Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                placeholder="........"
                className="industrial-input"
                required
              />
            </div>

            {/* Buton Create Account */}
            <button type="submit" className="massive-black-btn">
              CREATE ACCOUNT
            </button>
          </form>

          {/* Link către Sign In */}
          <div className="form-footer">
            Already have an account?
            <button type="button" className="text-link" onClick={onNavigateLogin}>
              Sign in
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default RegisterView;