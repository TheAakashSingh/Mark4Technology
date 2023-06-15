import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Registration from './Components/Registration';
import Login from './Components/Login';
import UserPage from './Components/UserPage';
import AdminPage from './Components/AdminPage';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [role, setRole] = useState('');

  const handleLogin = (token, userRole) => {
    setAccessToken(token);
    setRole(userRole);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/registration' element={<Registration />} />
        <Route path='/user' element={<UserPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/' element={!accessToken ? (
          <Login onLogin={handleLogin} />
        ) : role === 'user' ? (
          <UserPage accessToken={accessToken} />
        ) : role === 'admin' ? (
          <AdminPage accessToken={accessToken} />
        ) : (
          <p>Invalid role</p>
        )} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
