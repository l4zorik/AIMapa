import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';

// Pokud budeme mít globální styly specifické pro App, můžeme je importovat zde
// import './App.css'; // Tento soubor jsme smazali, ale můžeme vytvořit nový v případě potřeby

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="map" element={<MapPage />} />
        {/* Výchozí přesměrování, pokud žádná cesta nevyhovuje */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
