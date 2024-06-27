import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen/index";


export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const cld = new Cloudinary({
		cloud: {
			cloudName: 'dszc6zmjd'
		}
	});

	useEffect(() => {
		actions.syncToken();
	}, []);

	const handleLogout = async () => {
		await actions.logout();
		navigate("/login");
	};

	const handleProfile = () => {
		if (store.rol === "client") {
			navigate(`/clientportal/${store.user_id}`);
		} else {
			navigate(`/adminportal/${store.user_id}`);
		}
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light shadow-sm">
			<div className="container">
				<Link to="/" className="navbar-brand">
					<AdvancedImage
						cldImg={cld.image("logo_le99zk")}
						className="img-fluid rounded-circle"
						style={{ height: "50px", width: "50px" }}
						alt="Logo"
					/>
				</Link>
				<Link to="/about" className="nav-link">
					<span className="h4 text-black">About Us</span>
				</Link>
				<Link to="/services" className="nav-link">
					<span className="h4 text-black">Services</span>
				</Link>


				<div className="collapse navbar-collapse justify-content-end" id="navbarNav">
					{store.token ? (
						<div className="navbar-nav">
							<div className="d-flex justify-content-end align-items-center">
								<button
									className="btn btn-outline-primary nav-item custom-link text-truncate mx-1"
									style={{ maxWidth: "150px", width: "auto" }}
									onClick={handleProfile}
								>
									Profile
								</button>
								<button onClick={handleLogout} className="btn btn-outline-primary mx-1 " style={{ whiteSpace: "nowrap" }}>
									Log out
								</button>
							</div>
						</div>
					) : (
						<div className="navbar-nav">
							<Link to="/login" className="btn btn-outline-primary mx-2">Login</Link>
							<Link to="/signup" className="btn btn-outline-primary mx-2">Signup</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};
