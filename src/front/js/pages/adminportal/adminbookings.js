import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import AdminBookingCard from '../../component/adminBookingCard';

const AdminBookings = () => {
    const { actions } = useContext(Context);
    const [bookings, setBookings] = useState([]);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchBookingsAndRequests = async () => {
            const companyBookings = await actions.getCompanyBookings();
            setBookings(companyBookings);
            const companyRequests = await actions.getCompanyRequests();
            setRequests(companyRequests);
        };

        fetchBookingsAndRequests();
    }, [actions]);

    return (
        <div>
            <h2>Reservas y Peticiones</h2>
            <div className="container">
                <div className="row">
                    {bookings.map(booking => {
                        const relatedRequest = requests.find(req => req.bookings_id === booking.id);
                        return (
                            <div key={booking.id} className="col-12">
                                <AdminBookingCard booking={booking} request={relatedRequest} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
