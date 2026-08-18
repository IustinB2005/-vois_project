import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterView from './RegisterView';

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

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <RegisterView 
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      errorMessage={eroare}
      onNavigateLogin={handleNavigateToLogin}
    />
  );
}

export default Register;