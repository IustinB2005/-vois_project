import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginView from './LoginView';

export default function Login() {
  const navigate = useNavigate();
  // Folosim stările noi, separate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formBody = new URLSearchParams();
    // Aici am înlocuit formData.username cu 'email' și formData.password cu 'password'
    formBody.append('username', email);
    formBody.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString()
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token || data.token);
        navigate('/room');
      } else {
        let errorMessage = 'Email sau parolă incorectă.';
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map(err => err.msg).join(', ');
        }
        setError(errorMessage); // Actualizat de la setEroare la setError
      }
    } catch (err) {
      console.error(err);
      setError('Eroare de conexiune cu serverul.');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <LoginView 
      email={email}
      password={password}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleSubmit}
      errorMessage={error}
      onRegisterClick={handleRegisterClick} // Pasăm funcția către UI
    />
  );
}