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
                    <span className="text-black">Home</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link to="/about" className="nav-link">
                                <span className="text-muted">About Us</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/services" className="nav-link">
                                <span className="text-muted">Services</span>
                            </Link>
                        </li>
                    </ul>
                    <div className="navbar-nav ms-auto">
                        {store.token ? (
                            <div className="d-flex align-items-center">
                                <button
                                    className="btn btn-outline-primary nav-item custom-link text-truncate mx-1"
                                    style={{ maxWidth: "150px", width: "auto" }}
                                    onClick={handleProfile}
                                >
                                    Profile
                                </button>
                                <button onClick={handleLogout} className="btn btn-outline-primary mx-1" style={{ whiteSpace: "nowrap" }}>
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex flex-column flex-lg-row">
                                <Link to="/login" className="btn btn-outline-primary mx-2 my-1 my-lg-0">Login</Link>
                                <Link to="/signup" className="btn btn-outline-primary mx-2 my-1 my-lg-0">Signup</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
