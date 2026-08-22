import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionsView from './QuestionsView';

function QuestionsScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [eroare, setEroare] = useState('');

  // Decadele afișate în UI, mapate direct la valorile din backend
  const decadesMap = {
    "2010 - PRESENT": "2010-2020",
    "2000 - 2010": "2000-2010",
    "THE 90S": "1990-2000",
    "THE 80S": "1980-1990",
    "THE 70S": "1970-1980",
    "OLDER": "1970-1980"
  };

  // Genurile afișate în UI, mapate exact la string-urile din backend
  const genresMap = {
    "ACTION": "Actiune",
    "ROMANCE": "Romantic",
    "HORROR": "Horror",
    "COMEDY": "Comedie",
    "THRILLER": "Drama",
    "DRAMA": "Drama",
    "SCI-FI": "SF",
    "FANTASY": "Drama",
    "ANIMATION": "Comedie",
    "DOCUMENTARY": "Drama",
    "MYSTERY": "Drama",
    "ADVENTURE": "Actiune",
    "CRIME": "Drama",
    "WESTERN": "Actiune",
    "MUSICAL": "Romance"
  };

  const decades = Object.keys(decadesMap);
  const genres = Object.keys(genresMap);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:8000/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.preferred_decade) {
            // Facem invers maparea pentru a bifa corect în UI
            const revDecades = Object.entries(decadesMap).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {});
            const foundDecadeKey = revDecades[data.preferred_decade];
            if (foundDecadeKey) setSelectedDecades([foundDecadeKey]);
          }
          if (data.preferred_genre) {
            const revGenres = Object.entries(genresMap).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {});
            const foundGenreKey = revGenres[data.preferred_genre];
            if (foundGenreKey) setSelectedGenres([foundGenreKey]);
          }
        }
      } catch (err) {
        console.error("Eroare la preluarea preferințelor", err);
      }
    };

    fetchUserPreferences();
  }, []);

  const handleToggleDecade = (decade) => {
    if (selectedDecades.includes(decade)) {
      setSelectedDecades(selectedDecades.filter(d => d !== decade));
    } else {
      setSelectedDecades([decade]); // Backend-ul acceptă o singură valoare literară deocamdată
    }
  };

  const handleToggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([genre]); // Luăm prima selecție sau o trimitem pe a ales-o
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (selectedDecades.length === 0) {
      setEroare('Te rugăm să selectezi cel puțin o eră.');
      return;
    }
    setEroare('');
    setStep(2);
  };

  const handlePrevStep = () => {
    setEroare('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedGenres.length === 0) {
      setEroare('Te rugăm să selectezi cel puțin un gen.');
      return;
    }

    const token = localStorage.getItem('token');
    
    // Trimitem valorile transformate exact așa cum le cere backend-ul Pydantic
    const backendDecade = selectedDecades.length > 0 ? decadesMap[selectedDecades[0]] : null;
    const backendGenre = selectedGenres.length > 0 ? genresMap[selectedGenres[0]] : null;

    try {
      const response = await fetch('http://localhost:8000/users/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          preferred_decade: backendDecade,
          preferred_genre: backendGenre
        })
      });

      if (response.ok) {
        navigate('/home');
      } else {
        const data = await response.json();
        
        let errorMessage = 'Eroare la salvare.';
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map(err => err.msg).join(', ');
        } else if (typeof data.detail === 'object' && data.detail !== null) {
          errorMessage = JSON.stringify(data.detail);
        }
        
        setEroare(errorMessage);
      }
    } catch (err) {
      console.error(err);
      setEroare('Eroare de conexiune cu serverul.');
    }
  };

  return (
    <QuestionsView
      step={step}
      decades={decades}
      genres={genres}
      selectedDecades={selectedDecades}
      selectedGenres={selectedGenres}
      onToggleDecade={handleToggleDecade}
      onToggleGenre={handleToggleGenre}
      onNextStep={handleNextStep}
      onPrevStep={handlePrevStep}
      onSubmit={handleSubmit}
      errorMessage={eroare}
    />
  );
}

export default QuestionsScreen;