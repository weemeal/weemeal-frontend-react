import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    const version = process.env.REACT_APP_VERSION;

    return (
        <footer className="footer">
        <div className="footer-container">
        <div className="footer-left">
            {version} © 2024
    </div>
    <div className="footer-right">
    <a href="https://github.com/weemeal/weemeal-frontend-react" className="footer-link" target="_blank" rel="noopener noreferrer">
        Fork me on GitHub
    </a>
    <a href="https://github.com/weemeal/weemeal-frontend-react/issues" className="footer-link" target="_blank" rel="noopener noreferrer">
        Bug found or Feature Request?
        </a>
        </div>
        </div>
        </footer>
);
};

export default Footer;
