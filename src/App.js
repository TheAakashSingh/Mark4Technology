import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Registration from './Components/Registration';
import Login from './Components/Login';
import UserPage from './Components/UserPage';
import AdminPage from './Components/AdminPage';

function TokenHandler({ onTokenReceived }) {
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const accessToken = searchParams.get('accessToken');
    if (accessToken) {
      onTokenReceived(accessToken);
    }
  }, [onTokenReceived]);

  return null;
}

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  const handleLogin = (token, userRole) => {
    setAccessToken(token);
    setRole(userRole);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('role', userRole);
  };

  const handleTokenReceived = (token) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
  };

  const handleLogout = () => {
    setAccessToken('');
    setRole('');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
  };

  return (
    <BrowserRouter>
      <TokenHandler onTokenReceived={handleTokenReceived} />
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/userPage"
          element={<UserPage accessToken={accessToken} onLogout={handleLogout} />}
        />
        <Route
          path="/admin"
          element={<AdminPage accessToken={accessToken} onLogout={handleLogout} />}
        />
        <Route
          path="/"
          element={
            !accessToken ? (
              <Login onLogin={handleLogin} />
            ) : role === 'user' ? (
              <UserPage accessToken={accessToken} onLogout={handleLogout} />
            ) : role === 'admin' || role ==='moderator' ? (
              <AdminPage accessToken={accessToken} onLogout={handleLogout} />
            ) : (
              <p>Invalid role</p>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
