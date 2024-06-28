import React, {useContext,useEffect,useState} from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import "../../styles/ServiceCard.css";
import { Context } from "../store/appContext";

const ServiceCardAdmin = ({ service, onEdit, onDelete }) => {
    const { store, actions } = useContext(Context);
    const [serviceTypeName, setServiceTypeName] = useState("");
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dszc6zmjd'
        }
    });

    const myImage = service.image ? cld.image(service.image) : null;

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

    return (
        <div className="card mb-4">
            <div className="row no-gutters">
                <div className="col-md-4 d-none d-md-block">
                    <div className="card-img-left">
                        {myImage ? (
                            <AdvancedImage cldImg={myImage} className="img-cover" />
                        ) : (
                            <img src="https://dummyimage.com/300x200/cccccc/000000.jpg&text=No+image+available" alt="Default" className="img-cover" />
                        )}
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{service.name}</h5>
                        <p className="card-text">Description: {service.description}</p>
                        <p className="card-text">Type: {serviceTypeName}</p>
                        <p className="card-text">Price: {service.price}€</p>
                        <p className="card-text">Duration: {service.duration} minutes</p>
                        <p className="card-text">Available: {service.available ? "Yes" : "No"}</p>
                        <button className="btn btn-outline-primary btnwid me-2" onClick={() => onEdit(service)}>Edit</button>
                        <button className="btn btn-outline-danger btnwid" onClick={() => onDelete(service.id)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCardAdmin;
