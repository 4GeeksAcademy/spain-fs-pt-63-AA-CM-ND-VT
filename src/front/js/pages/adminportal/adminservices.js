import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import ServiceCardAdmin from "../../component/serviceCardAdmin";
import ImageInput from "../../component/imageInput";

const AdminServices = () => {
    const { actions } = useContext(Context); // No necesitamos el store aquí
    const [showModal, setShowModal] = useState(false);
    const [masterServices, setMasterServices] = useState([]);
    const [serviceData, setServiceData] = useState({
        name: "",
        description: "",
        type: "",
        price: "",
        duration: "",
        available: false,
        image: "",
        companyid: sessionStorage.getItem('company_id') // Obtener directamente de sessionStorage
    });
    const [refresh, setRefresh] = useState(false);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchMasterServices = async () => {
            const response = await actions.getMasterServices();
            if (response) {
                setMasterServices(response);
            }
        };

        fetchMasterServices();
    }, [actions]);

    useEffect(() => {
        const fetchServicesByCompany = async () => {
            const company_id = sessionStorage.getItem('company_id');
            if (company_id) {
                const response = await actions.getServicesByCompany(company_id);
                if (response) {
                    setServices(response);
                }
            }
        };

        fetchServicesByCompany();
    }, [actions, refresh]);

    // No necesitamos el useEffect para actualizar companyid, ya que lo tomamos de sessionStorage directamente

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData({ ...serviceData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setServiceData({ ...serviceData, available: e.target.checked });
    };

    const handleImageUpload = (imgId) => {
        setServiceData({ ...serviceData, image: imgId });
    };

    const handleSubmit = async () => {
        console.log("Submitting serviceData:", serviceData);
        if (serviceData.companyid) {
            const success = await actions.createService(serviceData);
            if (success) {
                setShowModal(false);
                setRefresh(!refresh);
            }
        } else {
            alert("Company ID is missing. Please try again later.");
        }
    };

    return (
        <div className="flex">
            <button className="btn btn-success rounded py-1 px-2" onClick={() => setShowModal(true)}>
                Create
            </button>
            <h3>{sessionStorage.getItem('company_id')}</h3>
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Service</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" className="form-control" id="name" name="name" value={serviceData.name} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <input type="text" className="form-control" id="description" name="description" value={serviceData.description} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="type">Type</label>
                                        <select className="form-control" id="type" name="type" value={serviceData.type} onChange={handleChange}>
                                            <option value="">Select a type</option>
                                            {masterServices.map((service) => (
                                                <option key={service.id} value={service.id}>
                                                    {service.type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="price">Price</label>
                                        <input type="number" className="form-control" id="price" name="price" value={serviceData.price} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="duration">Duration</label>
                                        <input type="number" className="form-control" id="duration" name="duration" value={serviceData.duration} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="available">Available</label>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="available" name="available" checked={serviceData.available} onChange={handleCheckboxChange} />
                                            <label className="form-check-label" htmlFor="available">Available</label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="image">Image</label>
                                        <ImageInput onUpload={handleImageUpload} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={() => handleSubmit()}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4">
                <h2>Services by Company</h2>
                <div className="container">
                    <div className="row">
                        {services.map(service => (
                            <div key={service.id} className="col-12">
                                <ServiceCardAdmin service={service} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminServices;
