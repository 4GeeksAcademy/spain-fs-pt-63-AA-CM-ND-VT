import React, { useContext } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import "../../styles/ServiceCard.css";
import {Context} from "../store/appContext"

const ServiceCardAdmin = ({ service }) => {
    const {actions,store} = useContext(Context)
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dszc6zmjd'
        }
    });

    // Crear la imagen de Cloudinary
    const myImage = service.image ? cld.image(service.image) : null;

    return (
        <div className="card mb-4">
            <div className="row no-gutters">
                <div className="col-md-4">
                    <div className="card-img-left">
                        {myImage ? <AdvancedImage cldImg={myImage} className="img-cover" /> : <p>No image available</p>}
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{service.name}</h5>
                        <p className="card-text">{service.description}</p>
                        <p className="card-text">Type: {service.type}</p>
                        <p className="card-text">Price: ${service.price}</p>
                        <p className="card-text">Duration: {service.duration} minutes</p>
                        <p className="card-text">Available: {service.available ? "Yes" : "No"}</p>
                        <p className="card-text">Image: {service.image}</p>
                    </div>
                </div>
                <button className="btn btn-danger rounded" onClick={() => actions.deleteServices(store.user_id, service.id)}>Delete</button>
            </div>
        </div>
    );
};

export default ServiceCardAdmin;
