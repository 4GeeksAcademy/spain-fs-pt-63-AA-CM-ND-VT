import React, { Component } from "react";

export const Footer = () => (
	<div className="container">
  <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <p className="col-md-4 mb-0 text-body-secondary">&copy; 2024 Company, Inc</p>

    <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
      <svg className="bi me-2" width="40" height="32"></svg>
    </a>

    <ul className="nav col-md-4 justify-content-end">
      <li className="nav-item"><a href="#" class="nav-link px-2 text-body-secondary">Recerva Tu Cita</a></li>
     
    </ul>
  </footer>
</div>
);
