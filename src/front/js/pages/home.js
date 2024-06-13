import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import ImageInput from "../component/imageInput";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen/index";

export const Home = () => {
    const { store, actions } = useContext(Context);

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dszc6zmjd'
        }
    })

    return (
        <div className="text-center mt-5">
            <h2>Navegaciones de prueba. El landing es lo último</h2>
            <p>Las páginas de demo y single no borrarlas de momento por si nos sirven de alguna duda</p>
            <ul className="list-unstyled">
                <li className="nav-item"><Link className="nav-link" to="/clientportal/:user_id">Client Portal</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/adminportal">Admin Portal</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/services">Services</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/services/companyprofile/:user_id">Company Profile for User</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/signin">Signin</Link></li>
                <li className="nav-item">{store.companyname ? store.companyname  :"no"}</li>
                <li className="nav-item">{store.company_id ? store.company_id  :"no"}</li>
            </ul>
            <ImageInput />
            <AdvancedImage  cldImg={cld.image("cld-sample")} className="perso" />
        </div>
    );
};
