import React from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBook} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link to="/" className="navbar-link">
                        <FontAwesomeIcon icon={faBook}/> Rezeptbuch
                    </Link>
                </div>
                <div className="navbar-right">
                    <Link to="/" className="navbar-logo">
                        <img src="/logo512.png" alt="WeeMeal Logo" className="logo" /> WeeMeal
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
