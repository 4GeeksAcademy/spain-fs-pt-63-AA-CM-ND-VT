import React, { useState } from 'react';
import '../../../styles/clientportal.css';
import UserBookings from './userbookings';
import UserProfile from './userprofile';
const ClientPortal = () => {
    const [activeTab, setActiveTab] = useState('reservas');

    const renderContent = () => {
        switch (activeTab) {
            case 'reservas':
                return <UserBookings />;
            case 'perfil':
                return <UserProfile />;
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
                            className={`nav-link ${activeTab === 'reservas' ? 'active' : ''}`}
                            href="#reservas"
                            onClick={() => setActiveTab('reservas')}
                        >
                            Reservas y Peticiones
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === 'perfil' ? 'active' : ''}`}
                            href="#perfil"
                            onClick={() => setActiveTab('perfil')}
                        >
                            Mi Perfil
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

export default ClientPortal;
