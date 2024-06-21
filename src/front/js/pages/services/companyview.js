import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CompanyView = () => {
    const { company_id } = useParams();
    const [company, setCompany] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/company/${company_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch company data');
                }
                const data = await response.json();
                setCompany(data);
                setServices(data.services);
                setLoading(false);
                console.log(data)
            } catch (error) {
                console.error('Error fetching company data:', error);
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!company) {
        return <div>Company not found</div>;
    }

    return (
        <div>
            <h2>{company.name}</h2>
            <p><strong>Location:</strong> {company.location}</p>
            <p><strong>Owner:</strong> {company.owner}</p>
            {company.image && <img src={company.image} alt={`${company.name} logo`} />}
            <h3>Services</h3>
            <div className="service-cards">
                {services.map(service => (
                    <div key={service.id} className="service-card">
                        <h4>{service.name}</h4>
                        <p>{service.description}</p>
                        <p><strong>Type:</strong> {service.type}</p>
                        <p><strong>Price:</strong> ${service.price}</p>
                        <p><strong>Duration:</strong> {service.duration} minutes</p>
                        {service.available ? <p>Available</p> : <p>Not Available</p>}
                        {service.image && <img src={service.image} alt={`${service.name}`} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyView;
