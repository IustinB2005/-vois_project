import { useState, useEffect } from 'react'

function App() {
  const [mesaj, setMesaj] = useState("Incarcare...")

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then(response => response.json())
      .then(data => {
        setMesaj(data.message)
      })
      .catch(error => {
        setMesaj("Eroare de conexiune cu backend-ul")
        console.log(error)
      })
  }, [])

  return (
    <div>
      <h1>Movie Tinder</h1>
      <p>Status Backend: {mesaj}</p>
    </div>
  )
}

export default App