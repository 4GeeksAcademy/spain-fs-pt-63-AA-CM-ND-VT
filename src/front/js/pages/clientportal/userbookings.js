import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import UserBookingCard from '../../component/userBookingCard';

const UserBookings = () => {
    const { actions } = useContext(Context);
    const [bookings, setBookings] = useState([]);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchBookingsAndRequests = async () => {
            const userBookings = await actions.getUserBookings();
            setBookings(userBookings);
            const userRequests = await actions.getUserRequests();
            setRequests(userRequests);
        };
    
        fetchBookingsAndRequests();
    }, [actions]);
    
    return (
        <div className="container">
            <h2 className="my-4">Bookings and Requests</h2>
            <div className="row">
                {bookings.map(booking => {
                    const relatedRequest = requests.find(req => req.bookings_id === booking.id);
                    return (
                        <div key={booking.id} className="col-sm-12 col-md-6 col-lg-4 d-flex align-items-stretch">
                            <UserBookingCard booking={booking} request={relatedRequest} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserBookings;
