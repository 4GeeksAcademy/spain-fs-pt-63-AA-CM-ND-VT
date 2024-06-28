import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";

const UserBookingCard = ({ booking, request }) => {
    const { actions } = useContext(Context);
    const [service, setService] = useState(null);

    useEffect(() => {
        const fetchService = async () => {
            const serviceData = await actions.getService(booking.services_id);
            if (serviceData) {
                setService(serviceData);
            }
        };

        fetchService();
    }, [actions, booking.services_id]);

    return (
        <div className="card h-100">
            <div className="card-body d-flex flex-column">
                <div className="row">
                    <div className="col-6">
                        <h5 className="card-title">Booking ID: {booking.id}</h5>
                        <p className="card-text">Date: {booking.start_day_date} {booking.start_time_date}h</p>
                        {request && (
                            <>
                                <p className="card-text">Request Status: {request.status}</p>
                                <p className="card-text">Request Comment: {request.comment ? request.comment : "No comments"}</p>
                            </>
                        )}
                    </div>
                    <div className="col-6">
                        {service && (
                            <>
                                <h5 className="card-title">Service Details</h5>
                                <p className="card-text">Name: {service.name}</p>
                                <p className="card-text">Description: {service.description}</p>
                                <p className="card-text">Price: {service.price}€</p>
                                <p className="card-text">Duration: {service.duration} minutes</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserBookingCard;
