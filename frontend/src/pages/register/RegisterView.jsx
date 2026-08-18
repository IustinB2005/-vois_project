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
    <div className="page-container">
      
      <header className="top-header">
        <div className="brand-logo">Cinematch</div>
      </header>

      <main className="main-content">
        
        <div className="watermark-bg">
          <span>JOIN</span>
        </div>

        <div className="form-wrapper">
          
          <h1 className="page-title">
            Join<br />Us.
          </h1>
          
          <div className="red-divider"></div>
          
          <p className="sub-title">
            Create your Cinematch account
          </p>

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <form onSubmit={onSubmit} className="register-form">
            
            <div className="input-group">
              <label htmlFor="username" className="input-label">
                <span className="label-number">01</span> Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={onChange}
                placeholder="cinephile42"
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email" className="input-label">
                <span className="label-number">02</span> Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                <span className="label-number">03</span> Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                placeholder="........"
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Create Account
            </button>
          </form>

          <div className="form-footer">
            Already have an account?{' '}
            <span className="login-link" onClick={onNavigateLogin}>
              Sign in
            </span>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default RegisterView;