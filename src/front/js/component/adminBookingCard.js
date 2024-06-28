import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../store/appContext';
import Swal from 'sweetalert2'

const AdminBookingCard = ({ booking, request, refreshData }) => {
    const { actions } = useContext(Context);
    const [comment, setComment] = useState('');

    const handleAccept = async () => {
        if (request) {
            const result = await actions.updateRequestStatus(request.id, 'Accepted', comment);
            if (result) {
                Swal.fire({
                    title: "Confirmed.",
                    text: "Request accepted successfully.",
                    icon: "success",
                    iconColor: "#f5e556",
                    confirmButtonColor: "#f5e556"
                  });
                refreshData();
            }
        }
    };

    const handleReject = async () => {
        if (request) {
            const result = await actions.updateRequestStatus(request.id, 'Rejected', comment);
            if (result) {
                Swal.fire({
                    title: "Confirmed.",
                    text: "Request rejected successfully.",
                    icon: "success",
                    iconColor: "#f5e556",
                    confirmButtonColor: "#f5e556"
                  });
                refreshData();
            }
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Accepted':
                return 'bg-success';
            case 'Rejected':
                return 'bg-danger';
            case 'Pending':
                return 'bg-warning';
            default:
                return 'bg-light';
        }
    };

    const statusClass = request ? getStatusClass(request.status) : 'bg-light';

    return (
        <div className={`card shadow-sm mb-4 ${statusClass}`}>
            <div className="card-header">
                <h5>Booking #{booking.id}</h5>
            </div>
            <div className="card-body text-black">
                <p className="card-text"><strong>User ID:</strong> {booking.users_id}</p>
                <p className="card-text"><strong>Information of the request:</strong> The request starts on {booking.start_day_date} at {booking.start_time_date}</p>
                {request && (
                    <>
                        <p className="card-text"><strong>Status:</strong> {request.status}</p>
                        <p className="card-text"><strong>Comments:</strong> {request.comment}</p>
                    </>
                )}
            </div>
            <div className="card-footer">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Add a comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-between">
                    <button
                        className="btn btn-outline-danger btnwid"
                        onClick={handleReject}
                    >
                        Decline
                    </button>
                    <button
                        className="btn btn-outline-success btnwid"
                        onClick={handleAccept}
                    >
                        Accept
                    </button>

                </div>
            </div>
        </div>
    );
};

AdminBookingCard.propTypes = {
    booking: PropTypes.object.isRequired,
    request: PropTypes.object,
    refreshData: PropTypes.func.isRequired,
};

export default AdminBookingCard;
