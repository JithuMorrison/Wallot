import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AuthPage from './auth';
import Dashboard from './dash';
import Expenses from './expense';
import Budgets from './budgets';
import Reports from './reports';
import Navbar from './navbar';

axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/auth/verify');
          setIsAuthenticated(true);
          setUser(res.data.user);
        } catch (err) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      {isAuthenticated && <Navbar logout={logout} />}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Dashboard user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <AuthPage type="login" login={login} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <AuthPage type="register" login={login} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/expenses"
          element={
            isAuthenticated ? (
              <Expenses user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/budgets"
          element={
            isAuthenticated ? (
              <Budgets user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated ? (
              <Reports user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;