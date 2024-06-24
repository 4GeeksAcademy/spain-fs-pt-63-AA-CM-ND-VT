import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";
import '../../../styles/clientportal.css';
import UserBookings from './userbookings';
import UserProfile from './userprofile';

const ClientPortal = () => {
    const [activeTab, setActiveTab] = useState('reservas');
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.syncToken();
        if (!sessionStorage.getItem("token")) {
            navigate("/login");
        }
    }, [store.token]);

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
                            Bookings and Requests:
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === 'perfil' ? 'active' : ''}`}
                            href="#perfil"
                            onClick={() => setActiveTab('perfil')}
                        >
                            My Profile
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
