import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen.js';
import SearchPage from './pages/SearchPage.js';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    authenticateUser();
  }, []);

  const authenticateUser = () => {
    axios
      .post('https://frontend-take-home-service.fetch.com/auth/login', {
        name: 'example',
        email: 'example@example.com'
      })
      .then((response) => {
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        setIsAuthenticated(false);
        console.error(error);
      });
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route 
          path="/search" element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace />}/>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
