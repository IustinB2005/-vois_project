import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register/Register';
import Login from "./pages/login/Login";
import QuestionsScreen from './pages/questions/QuestionsScreen';
import Room from './pages/Room';
import Home from './pages/home/Home';  
import Lobby from './pages/lobby/Lobby';
import ProtectedRoute from './ProtectedRoute'; // <-- 1. Importul corect (fișierul e direct în src)
import SwipeScreen from './pages/swipe/SwipeScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute publice (orcine le poate accesa fără login) */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rute protejate (necesită token în localStorage) */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/lobby" 
          element={
            <ProtectedRoute>
              <Lobby />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/room" 
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/questions" 
          element={
            <ProtectedRoute>
              <QuestionsScreen />
            </ProtectedRoute>
          } 
        />

        <Route 
        path="/swipe" 
       element={
        <ProtectedRoute>
          <SwipeScreen />
        </ProtectedRoute>
      } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;