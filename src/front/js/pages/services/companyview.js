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
            <h3>Services</h3>
            <div className="service-cards">
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
