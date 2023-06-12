import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Registration from './Components/Registration';
import Login from './Components/Login';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Registration />} />
      <Route path='/Login' element={<Login />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
