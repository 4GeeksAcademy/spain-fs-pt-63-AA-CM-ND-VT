import React from "react";

const ServiceCard = ({ service }) => {
    return (
        <div className="card mb-4">
            <img src={service.image} className="card-img-top" alt={service.name} />
            <div className="card-body">
                <h5 className="card-title">{service.name}</h5>
                <p className="card-text">{service.description}</p>
                <p className="card-text">Type: {service.type}</p>
                <p className="card-text">Price: ${service.price}</p>
                <p className="card-text">Duration: {service.duration} minutes</p>
                <p className="card-text">Available: {service.available ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default ServiceCard;
