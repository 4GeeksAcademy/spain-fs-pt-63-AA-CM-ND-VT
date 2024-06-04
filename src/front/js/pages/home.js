import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="text-center mt-5">
            <h2>Navegaciones de prueba. El landing es lo último</h2>
            <p>Las paginas de demo y single no borrarlas de momento por si nos sirven de alguna duda</p>
            <ul className="list-unstyled">
                <li className="nav-item"><Link className="nav-link" to="/clientportal">Client Portal</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/adminportal">Admin Portal</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/services">Services</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/services/companyprofile">Company Profile for User</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/signin">Signin</Link></li>
            </ul>
        </div>
    );
};
