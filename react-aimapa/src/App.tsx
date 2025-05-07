import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EnhancedMapPage from './pages/EnhancedMapPage';
import './App.css';

// Komponenty stránek
const HomePage: React.FC = () => (
  <div className="page home-page">
    <h1>AI Mapa</h1>
    <p>Vítejte v aplikaci AI Mapa!</p>

    <div className="features-section">
      <h2>Funkce aplikace</h2>
      <div className="features-grid">
        <div className="feature-card">
          <i className="fas fa-map-marked-alt"></i>
          <h3>Interaktivní mapa</h3>
          <p>Prozkoumejte místa pomocí různých mapových podkladů</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-robot"></i>
          <h3>AI asistent</h3>
          <p>Získejte pomoc s navigací a informace o místech</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-route"></i>
          <h3>Plánování tras</h3>
          <p>Naplánujte si cestu mezi různými body</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-search-location"></i>
          <h3>Pokročilé vyhledávání</h3>
          <p>Najděte místa pomocí přirozeného jazyka</p>
        </div>
      </div>
    </div>
  </div>
);

const ProfilePage: React.FC = () => (
  <div className="page profile-page">
    <h1>Profil</h1>
    <p>Zde bude profil uživatele.</p>
  </div>
);

// Hlavní komponenta
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="logo">
            <Link to="/">AIMapa</Link>
          </div>
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Domů</Link></li>
              <li><Link to="/map">Mapa</Link></li>
              <li><Link to="/profile">Profil</Link></li>
            </ul>
          </nav>
          <div className="auth-status">
            <button className="login-button">Přihlásit se</button>
          </div>
        </header>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<EnhancedMapPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>&copy; 2024 AIMapa. Všechna práva vyhrazena.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
