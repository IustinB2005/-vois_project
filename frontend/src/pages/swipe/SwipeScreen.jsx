import { useState, useMemo, createRef, useEffect } from 'react';
import SwipeView from './SwipeView';

const filmeTest = [
  { id: 101, nume: 'Interstellar', urlImagine: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MvrIdZ2O.jpg' },
  { id: 102, nume: 'Inception', urlImagine: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
  { id: 103, nume: 'The Dark Knight', urlImagine: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' }
];

export default function SwipeScreen() {
  const [filme, setFilme] = useState(filmeTest);
  const [ultimaActiune, setUltimaActiune] = useState(null);
  const totalFilme = filmeTest.length;

  // Pregătit pentru momentul în care colegul adaugă ruta de filme în backend
  /*
  useEffect(() => {
    fetch('http://localhost:8000/api/movies', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => res.json())
      .then((data) => setFilme(data))
      .catch((err) => console.log("Eroare la preluarea filmelor:", err));
  }, []);
  */

  const childRefs = useMemo(
    () => filme.map(() => createRef()),
    [filme]
  );

  const onSwipe = (direction, film, index) => {
    setUltimaActiune({ film, index });
    if (direction === 'right') {
      console.log(`❤️ LIKE trimis pentru: ${film.nume}`);
    } else if (direction === 'left') {
      console.log(`❌ PASS trimis pentru: ${film.nume}`);
    }
    setFilme((prevFilme) => prevFilme.filter((f) => f.id !== film.id));
  };

  const anuleazaUltimulSwipe = async () => {
    if (!ultimaActiune) return;
    const { film, index } = ultimaActiune;
    
    setFilme((prev) => [film, ...prev]);
    setUltimaActiune(null);

    if (childRefs[index] && childRefs[index].current) {
      await childRefs[index].current.restoreCard();
    }
  };

  return (
    <SwipeView
      filme={filme}
      totalFilme={totalFilme}
      childRefs={childRefs}
      onSwipe={onSwipe}
      ultimaActiune={ultimaActiune}
      anuleazaUltimulSwipe={anuleazaUltimulSwipe}
    />
  );
}