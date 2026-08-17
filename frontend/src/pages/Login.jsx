import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [eroare, setEroare] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEroare('');

    const formBody = new URLSearchParams();
    formBody.append('username', formData.username);
    formBody.append('password', formData.password);

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
        setEroare(errorMessage);
      }
    } catch (error) {
      console.error(error);
      setEroare('Eroare de conexiune cu serverul.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Autentificare</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          name="username"
          placeholder="Email / Nume utilizator"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Parolă"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Intră în cont</button>
      </form>
      {eroare && <p style={{ color: 'red' }}>{eroare}</p>}
      <p style={{ marginTop: '20px' }}>
        Nu ai cont? <button onClick={() => navigate('/register')}>Creează unul</button>
      </p>
    </div>
  );
}

export default Login;