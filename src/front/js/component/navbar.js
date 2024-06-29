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
                <Link to="/" className="nav-link px-2 text-body-secondary ">
                    <span className="text-black">Home</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                    </svg>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link to="/about" className="nav-link px-2 text-body-secondary">
                                <span >About Us</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/services" className="nav-link px-2 text-body-secondary">
                                <span>Services</span>
                            </Link>
                        </li>
                        <li><hr class="dropdown-divider"></hr></li>
                    </ul>
                    <div className="navbar-nav ms-auto">
                        {store.token ? (
                            <div className="d-flex align-items-center">
                                <button
                                    className="btn btn-outline-primary mx-1 btnwid"

                                    onClick={handleProfile}
                                >
                                    Profile
                                </button>
                                <button onClick={handleLogout} className="btn btn-outline-primary mx-1 btnwid" >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex flex-column flex-lg-row">
                                <Link to="/login" className="btn btn-outline-primary mx-2 my-1 my-lg-0 btnwid">Login</Link>
                                <Link to="/signup" className="btn btn-outline-primary mx-2 my-1 my-lg-0 btnwid">Signup</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
