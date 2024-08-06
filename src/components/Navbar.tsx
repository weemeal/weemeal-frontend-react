// src/components/Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Importiere die CSS-Datei für die Navigation

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Rezeptverwaltung
                </Link>
                <div className="navbar-links">
                    <Link to="/" className="navbar-link">Home</Link>
                    <Link to="/new" className="navbar-link">Neues Rezept</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
