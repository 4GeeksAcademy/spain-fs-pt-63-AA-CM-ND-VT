import React, { useState, useContext } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import "../../styles/ServiceCard.css";
import { Context } from '../store/appContext';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const navigate = useNavigate();

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dszc6zmjd'
        }
    });

    const myImage = service.image ? cld.image(service.image) : null;

    const handleReserve = async () => {
        const reservationData = {
            services_id: service.id,
            start_day_date: date,
            start_time_date: time,
            user_id: store.user_id
        };
        const success = await actions.reserveService(reservationData);
        if (success) {
            console.log("Service reserved:", reservationData);
            setShow(false);
        } else {
            alert("Failed to reserve the service. Please try again.");
        }
    };

    const handleCompany = async () => {
        const success = await actions.updateCompanyPageId(service.id);
        if (success) {
            navigate(`/services/companyprofile/${store.companypage_id}`);
        }
    };

    return (
        <div className="card mb-4">
            <div className="row no-gutters">
                <div className="col-md-4">
                    <div className="card-img-left">
                        {myImage ? <AdvancedImage cldImg={myImage} className="img-cover" /> : <p>No image available</p>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{service.name}</h5>
                        <p className="card-text">{service.id}</p>
                        <p className="card-text">{service.description}</p>
                        <p className="card-text">Type: {service.type}</p>
                        <p className="card-text">Price: ${service.price}</p>
                        <p className="card-text">Duration: {service.duration} minutes</p>
                        <p className="card-text">Available: {service.available ? "Yes" : "No"}</p>
                        <p className="card-text">Image: {service.image}</p>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="mt-3">
                        <Link to="/companyview/:company_id"><button className="btn btn-info rounded py-1 px-2 m-2">Company</button></Link>
                        <button className="btn btn-success rounded py-1 px-2 m-2" onClick={() => {store.user_id ? setShow(true) : navigate("/login") }}>Reserve</button>
                    </div>
                </div>
            </div>

            {show && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reserve {service.name}</h5>
                                <button type="button" className="close" aria-label="Close" onClick={() => setShow(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <p><strong>Description:</strong> {service.description}</p>
                                    <p><strong>Type:</strong> {service.type}</p>
                                    <p><strong>Price:</strong> ${service.price}</p>
                                    <p><strong>Duration:</strong> {service.duration} minutes</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="formDate">Select Date</label>
                                    <input type="date" className="form-control" id="formDate" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="formTime">Select Time</label>
                                    <input type="time" className="form-control" id="formTime" value={time} onChange={(e) => setTime(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShow(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleReserve}>Reserve</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceCard;
