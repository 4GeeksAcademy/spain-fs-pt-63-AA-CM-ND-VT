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
                <div className="col-12 col-sm-6 col-md-4 mb-2">
                    <div className="d-flex align-items-center">
                        <label htmlFor="filterStatus" className="form-label mb-0 me-2">Filter by status:</label>
                        <select
                            id="filterStatus"
                            className="form-select"
                            value={filterStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="Todas">All</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="row">
                {bookings.map(booking => {
                    const relatedRequest = filteredRequests.find(req => req.bookings_id === booking.id);
                    if (!relatedRequest && filterStatus !== 'Todas') return null;
                    return (
                        <div key={booking.id} className="col-12 col-md-6 col-lg-4 mb-4">
                            <AdminBookingCard booking={booking} request={relatedRequest} refreshData={fetchBookingsAndRequests} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminBookings;
