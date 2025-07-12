import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { ThemeProvider, useTheme } from './themes/ThemeProvider';
import './styles/themes.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

const AppContent = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Hello Chat World</h1>
    <ThemeToggleButton />
  </div>
);

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;