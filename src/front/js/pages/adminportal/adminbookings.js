import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import AdminBookingCard from '../../component/adminBookingCard';
import '../../../styles/AdminBookings.css';

const AdminBookings = () => {
    const { actions } = useContext(Context);
    const [bookings, setBookings] = useState([]);
    const [requests, setRequests] = useState([]);
    const [filterStatus, setFilterStatus] = useState('Todas');

    const fetchBookingsAndRequests = async () => {
        const companyBookings = await actions.getCompanyBookings();
        setBookings(companyBookings);
        const companyRequests = await actions.getCompanyRequests();
        setRequests(companyRequests);
    };

    useEffect(() => {
        fetchBookingsAndRequests();
    }, [actions]);

    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    const filteredRequests = requests.filter(request => {
        if (filterStatus === 'Todas') return true;
        return request.status === filterStatus;
    });

    return (
        <div className="container">
            <div className="row my-4">
                <div className="col-md-4 col-sm-6">
                    <label htmlFor="filterStatus" className="form-label">Filter by status:</label>
                    <select
                        id="filterStatus"
                        className="form-select"
                        value={filterStatus}
                        onChange={handleFilterChange}
                    >
                        <option value="Todas">All</option>
                        <option value="Aceptada">Accepted</option>
                        <option value="Rechazada">Declined</option>
                        <option value="Pendiente">Pending</option>
                    </select>
                </div>
            </div>
            <div className="row">
                {bookings.map(booking => {
                    const relatedRequest = filteredRequests.find(req => req.bookings_id === booking.id);
                    if (!relatedRequest && filterStatus !== 'Todas') return null;
                    return (
                        <div key={booking.id} className="col-lg-6 col-md-12 mb-4">
                            <AdminBookingCard booking={booking} request={relatedRequest} refreshData={fetchBookingsAndRequests} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminBookings;
