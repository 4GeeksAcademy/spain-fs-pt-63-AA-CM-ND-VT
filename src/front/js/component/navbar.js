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
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse justify-content-end" id="navbarNav">
					{store.token ? (
						<div className="navbar-nav">
							{store.rol === "client" ? (
								<Link to={`/clientportal/${store.user_id}`}><span className="nav-item nav-link">Hello, {store.username}</span></Link>
							) : (
								<Link to={`/adminportal/${store.user_id}`}><span className="nav-item nav-link">Hello, {store.username}</span></Link>
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
