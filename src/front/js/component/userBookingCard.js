import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const UserBookingCard = ({ booking, request }) => {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Booking ID: {booking.id}</h5>
                <p className="card-text">Service ID: {booking.services_id}</p>
                <p className="card-text"> Date: {booking.start_day_date}</p>
                <p className="card-text"> Time: {booking.start_time_date}</p>
                {request && (
                    <>
                        <p className="card-text">Status: {request.status}</p>
                        <p className="card-text">Comment: {request.comment ? request.comment : "No comment"}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserBookingCard;
