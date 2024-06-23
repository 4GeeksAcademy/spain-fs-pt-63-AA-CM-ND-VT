import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	useEffect(() => {
		actions.syncToken();
	}, []);

	const handleLogout = async () => {
		await actions.logout();
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light shadow-sm">
			<div className="container">
				<Link to="/" className="navbar-brand">
					<span className="h4">Home</span>
				</Link>
				<Link to="/services" className="nav-link">
					<span className="h4">Services</span>
				</Link>
				<button className="navbar-toggler btn-outline-primary" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill custom-icon" viewBox="0 0 16 16">
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
</svg>
				</button>
				<div className="collapse navbar-collapse justify-content-end" id="navbarNav">
					{store.token ? (
						<div className="navbar-nav">
							{store.rol === "client" ? (
								<Link to={`/clientportal/${store.user_id}`}><span className="nav-item nav-link custom-link">Hello, {store.username}</span></Link>
							) : (
								<Link to={`/adminportal/${store.user_id}`}><p className="nav-item nav-link custom-link">Hello, {store.username}</p></Link>
							)}
							<button onClick={handleLogout} className="btn btn-outline-primary mx-3">Log out</button>
						</div>
					) : (
						<div className="navbar-nav">
							<Link to="/login" className="btn btn-outline-primary ">Login</Link>
							<Link to="/signup" className="btn btn-outline-secondary mx-2">Signup</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};
