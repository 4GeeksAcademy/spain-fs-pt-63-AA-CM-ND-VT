import React, { useState, useEffect, useContext } from "react";
import { Context } from '../../store/appContext';
import ServiceCard from '../../component/serviceCard';

const Services = () => {
    const { store, actions } = useContext(Context);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchAllServices = async () => {
            const response = await actions.getAllServices();
            if (response) {
                setServices(response);
            }
        };

        fetchAllServices();
    }, [actions]);

    return (
        <div>
            <h3>All Services</h3>
            <div className="mt-4">
                <div className="container">
                    <div className="row">
                        {services.map(service => (
                            <div key={service.id} className="col-md-4">
                                <ServiceCard service={service} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
