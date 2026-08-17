import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
    setEroare(''); // Resetăm erorile anterioare

    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
       
        navigate('/questions');
      } else {
        const data = await response.json();

        let errorMessage = 'Eroare la crearea contului.';
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
      <h2>Creare Cont Nou</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          name="username"
          placeholder="Nume utilizator"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
        <button type="submit">Înregistrare</button>
      </form>
      {eroare && <p style={{ color: 'red' }}>{eroare}</p>}
      <p style={{ marginTop: '20px' }}>
        Ai deja cont? <button onClick={() => navigate('/login')}>Intră aici</button>
      </p>
    </div>
  );
}

export default Register;