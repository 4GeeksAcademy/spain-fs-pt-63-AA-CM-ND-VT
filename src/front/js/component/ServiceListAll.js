import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import ServiceCard from "./ServiceCard";

const ServiceListAll = () => {
    const { actions } = useContext(Context);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            const response = await actions.getAllServices();
            if (response) {
                setServices(response);
            }
        };

        fetchServices();
    }, [actions]);

    return (
        <div className="container">
            <div className="row">
                {services.map(service => (
                    <div key={service.id} className="col-md-4">
                        <ServiceCard service={service} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceListAll;
