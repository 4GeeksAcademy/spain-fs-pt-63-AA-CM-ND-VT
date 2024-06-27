import React, { useState, useEffect, useContext } from "react";
import { Context } from '../../store/appContext';
import ServiceCard from '../../component/serviceCard';

const Services = () => {
    const { store, actions } = useContext(Context);
    const [services, setServices] = useState([]);

    useEffect(() => {
        let mounted = true;

        const fetchAllServices = async () => {
            const response = await actions.getAllServices();
            if (mounted && response) {
                console.log("Fetched services: ", response);
                setServices(response);
            }
        };

        fetchAllServices();

        return () => {
            mounted = false;
        };
    }, [actions]);

    return (
        <div>
            <h1 className="text-center mt-5">Services</h1>
            <div className="mt-5">
                <div className="container">
                    <div className="row">
                        {services.map(service => (
                            <div key={service.id} className="col-12">
                                <ServiceCard service={service} companyId={service.companies_id} hideCompanyButton={false} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
