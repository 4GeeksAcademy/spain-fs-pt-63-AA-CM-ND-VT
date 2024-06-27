import React, { useState, useContext, useEffect } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import "../../styles/ServiceCard.css";
import { Context } from '../store/appContext';
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service, companyId, hideCompanyButton }) => {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [serviceTypeName, setServiceTypeName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMasterServices = async () => {
            const masterServices = await actions.getMasterServices();
            const serviceType = masterServices.find(ms => ms.id === service.type);
            if (serviceType) {
                setServiceTypeName(serviceType.type);
            }
        };

        fetchMasterServices();
    }, [service.type, actions]);

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
        await actions.setCompanyIdService(companyId);
        if (store.company_id_service) {
            navigate(`/companyview/${store.company_id_service}`);
        } else {
            alert("Company ID is not available for this service");
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
                    <div className="card-body rounded m-2">
                        <h3 className="card-title text-center">{service.name}</h3>
                        <p className="card-text">Description:{service.description}</p>
                        <p className="card-text">Type: {serviceTypeName}</p>
                        <p className="card-text">Price: ${service.price}</p>
                        <p className="card-text">Duration: {service.duration} minutes</p>
                        <p className="card-text">Available: {service.available ? "Yes" : "No"}</p>
                        <p className="card-text">Location: {service.location}</p>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="mt-3">
                        {!hideCompanyButton && (
                            <button className="btn btn-outline-primary rounded py-1 px-2 m-2" onClick={handleCompany}>Company</button>
                        )}
                        <button className="btn btn-outline-primary rounded py-1 px-2 m-2" onClick={() => { store.user_id ? setShow(true) : navigate("/login") }}>Reserve</button>


                    </div>
                </div>
            </div>

            {show && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reserve {service.name}</h5>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <p><strong>Description:</strong> {service.description}</p>
                                    <p><strong>Type:</strong> {serviceTypeName}</p>
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
                                <button type="button" className="btn btn-outline-primary" onClick={() => setShow(false)}>Close</button>
                                <button type="button" className="btn btn-outline-primary" onClick={handleReserve}>Reserve</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceCard;
