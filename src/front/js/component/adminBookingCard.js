import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../store/appContext';
import Swal from 'sweetalert2'

const AdminBookingCard = ({ booking, request, refreshData }) => {
    const { actions } = useContext(Context);
    const [comment, setComment] = useState('');

    const handleAccept = async () => {
        if (request) {
            const result = await actions.updateRequestStatus(request.id, 'Aceptada', comment);
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
            const result = await actions.updateRequestStatus(request.id, 'Rechazada', comment);
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
            case 'Aceptada':
                return 'bg-success';
            case 'Rechazada':
                return 'bg-danger';
            case 'Pendiente':
                return 'bg-warning';
            default:
                return 'bg-light';
        }
    };

    const statusClass = request ? getStatusClass(request.status) : 'bg-light';

    return (
        <div className={`card shadow-sm mb-4 ${statusClass}`}>
            <div className="card-header">
                <h5 className="card-title">Reserva #{booking.id}</h5>
            </div>
            <div className="card-body text-black">
                <p className="card-text"><strong>User ID:</strong> {booking.users_id}</p>
                <p className="card-text"><strong>Information of the request:</strong> The request starts on {booking.start_day_date} at {booking.start_time_date}</p>
                {request && (
                    <>
                        <h6 className="card-subtitle mb-2">Request</h6>
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
                        placeholder="Agregar un comentario"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-between">
                    <button
                        className="btn btn-outline-success"
                        onClick={handleAccept}
                    >
                        Accept
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        onClick={handleReject}
                    >
                        Decline
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
