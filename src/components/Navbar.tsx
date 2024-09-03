// src/components/Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    const version = process.env.REACT_APP_VERSION;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Rezeptverwaltung  <span className="version">{process.env.REACT_APP_VERSION}</span>
                </Link>
                <div className="navbar-links">
                    <Link to="/new" className="navbar-link">Neues Rezept</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
