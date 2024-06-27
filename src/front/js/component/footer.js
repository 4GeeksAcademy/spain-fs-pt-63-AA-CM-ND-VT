import React from "react";
import { Link } from "react-router-dom";
import "../../styles/footer.css";


export const Footer = () => (
    <footer className="footer mt-auto py-3 bg-light border-top">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
            <div className="d-flex justify-content-center">
                <Link to="/" className="nav-link px-2 text-body-secondary small-link">Home</Link>
                <Link to="/services" className="nav-link px-2 text-body-secondary small-link">Services</Link>
                <Link to="/about" className="nav-link px-2 text-body-secondary small-link">About Us</Link>
            </div>
            <a href="#" className="nav-link px-2 text-body-secondary small-link">Scroll to Top</a>
        </div>
    </footer>
);
