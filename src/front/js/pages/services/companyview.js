import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ServiceCard from '../../component/serviceCard';

const CompanyView = () => {
    const { company_id } = useParams();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchCompanyServices = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/company/${company_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }
                const data = await response.json();
                if (mounted) {
                    setServices(data.services);
                    setLoading(false);
                }
            } catch (error) {
                if (mounted) {
                    console.error('Error fetching services:', error);
                    setLoading(false);
                }
            }
        };

        fetchCompanyServices();

        return () => {
            mounted = false;
        };
    }, [company_id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className='mt-5 text-center'> nombre de la compañia Services</h1>
            <h3 className='text-center mt-2'>Take a look to my Services!</h3>
            <div className="service-cards mt-5 container">
                {services.map(service => (
                    <div key={service.id} className="service-card">
                        <ServiceCard service={service} hideCompanyButton={true} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyView;
