import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // Dacă nu există token, trimitem utilizatorul la pagina de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Dacă există token, îi permitem accesul la pagina dorită (children)
  return children;
}