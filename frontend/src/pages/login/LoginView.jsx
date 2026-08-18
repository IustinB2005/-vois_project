import React from 'react';
import './LoginView.css';

const LoginView = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  errorMessage,
  onRegisterClick // Am adăugat prop-ul nou pentru navigare
}) => {
  return (
    <div className="page-container">
      
      <header className="top-header">
        <div className="brand-logo">Cinematch</div>
        
      </header>

      <main className="main-content">
        
        <div className="watermark-bg">
          <span>CM</span>
        </div>

        <div className="form-wrapper">
          
          <h1 className="page-title">
            Sign<br />In.
          </h1>
          
          <div className="red-divider"></div>
          
          <p className="sub-title">
            Welcome back to Cinematch
          </p>

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <form onSubmit={onSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                <span className="label-number">01</span> Email Address
              </label>
              <input
                id="email"
                type="text" // Modificat în text dacă API-ul așteaptă 'username' și poate fi un nume de utilizator
                value={email}
                onChange={onEmailChange}
                placeholder="Email / Nume utilizator"
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                <span className="label-number">02</span> Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={onPasswordChange}
                placeholder="........"
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Sign In
            </button>
          </form>

          <div className="form-footer">
            No account?{' '}
            <span 
              className="register-link" 
              onClick={onRegisterClick} // Declanșăm funcția la click
              style={{ cursor: 'pointer' }}
            >
              Register here
            </span>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default LoginView;