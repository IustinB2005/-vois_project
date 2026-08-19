import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/register/Register';
import Login from "./pages/login/Login";
import Questions from './pages/Questions';
import Room from './pages/Room';
import SwipeScreen from './pages/swipe/SwipeScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* redirec automat la login cand intri pe localhost:5173 */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* rutele app */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/room" element={<Room />} />
        <Route path="/swipe" element={<SwipeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;