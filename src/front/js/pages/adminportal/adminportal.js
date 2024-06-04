import React, { useState } from 'react';

import AdminBookings from './adminbookings';
import AdminServices from './adminservices';
import CompanyProfile from './companyprofile';

const AdminPortal = () => {
    const [activeTab, setActiveTab] = useState('adminbookings');

    const renderContent = () => {
        switch (activeTab) {
            case 'adminbookings':
                return <AdminBookings />;
            case 'adminservices':
                return <AdminServices />;
            case 'companyprofile':
                return <CompanyProfile />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="container mt-4">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === 'adminbookings' ? 'active' : ''}`}
                            href="#adminbookings"
                            onClick={() => setActiveTab('adminbookings')}
                        >
                            Admin Reservas
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === 'adminservices' ? 'active' : ''}`}
                            href="#adminservices"
                            onClick={() => setActiveTab('adminservices')}
                        >
                            Admin Servicios
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === 'companyprofile' ? 'active' : ''}`}
                            href="#companyprofile"
                            onClick={() => setActiveTab('companyprofile')}
                        >
                            Perfil de la Compañía
                        </a>
                    </li>
                </ul>
                <div className="tab-content mt-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;
