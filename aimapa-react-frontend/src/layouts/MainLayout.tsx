import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css'; // Import CSS Modules

const MainLayout: React.FC = () => {
  return (
    <div className={styles.appContainer}> {/* Použití stylu z CSS Modules */}
      <header className={styles.appHeader}>
        <h1>AIMapa - React Edition</h1>
        {/* Zde může být navigační menu v budoucnu */}
      </header>
      <main className={styles.appMainContent}>
        <Outlet /> {/* Zde se budou renderovat jednotlivé stránky */}
      </main>
      <footer className={styles.appFooter}>
        <p>© 2024 AIMapa React Edition</p>
      </footer>
    </div>
  );
};

export default MainLayout;
