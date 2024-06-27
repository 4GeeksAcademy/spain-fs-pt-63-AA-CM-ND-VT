import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen/index";

export const Home = () => {
    const { store, actions } = useContext(Context);

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dszc6zmjd'
        }
    });

    return (
        <div className="text-center mt-5">
            <header className="bg-light py-5">
                <div className="container px-5">
                    <div className="row gx-5 align-items-center justify-content-center">
                        <div className="col-lg-8 col-xl-7 col-xxl-6">
                            <div className="my-5 text-center text-xl-start">
                                <h1 className="display-5 fw-bolder text-dark mb-2">Welcome to Our Hairdressing Platform</h1>
                                <p className="lead fw-normal text-dark-50 mb-4">Register as a client or company to easily and quickly hire and offer hairdressing services.</p>
                                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                                    <Link to="/signup" className="btn btn-yellow btn-lg px-4 me-sm-3">Register</Link>
                                    <Link to="/services" className="btn btn-outline-dark btn-lg px-4">View Services</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-xxl-6 d-none d-xl-block text-center">
                            <AdvancedImage cldImg={cld.image('16038955669798_goqtba')} className="img-fluid rounded-3 my-5" alt="Hairdressing Image" />
                        </div>
                    </div>
                </div>
            </header>
            <section className="py-5">
                <div className="container px-5 my-5">
                    <div className="row gx-5">
                        <div className="col-lg-4 mb-5 mb-lg-0">
                            <h2 className="fw-bolder text-dark">How It Works</h2>
                        </div>
                        <div className="col-lg-8">
                            <div className="row gx-5 row-cols-1 row-cols-md-2">
                                <div className="col mb-5 h-100">
                                    <div className="feature bg-yellow text-white rounded-3 mb-3"><i className="bi bi-pencil-square"></i></div>
                                    <h2 className="h5">Registration</h2>
                                    <p className="mb-0">Register as a client or company to access all our features.</p>
                                </div>
                                <div className="col mb-5 h-100">
                                    <div className="feature bg-yellow text-white rounded-3 mb-3"><i className="bi bi-card-checklist"></i></div>
                                    <h2 className="h5">Service Posting</h2>
                                    <p className="mb-0">Companies can post their services and available schedules.</p>
                                </div>
                                <div className="col mb-5 mb-md-0 h-100">
                                    <div className="feature bg-yellow text-white rounded-3 mb-3"><i className="bi bi-calendar-check"></i></div>
                                    <h2 className="h5">Service Booking</h2>
                                    <p className="mb-0">Clients can book services at their preferred time.</p>
                                </div>
                                <div className="col h-100">
                                    <div className="feature bg-yellow text-white rounded-3 mb-3"><i className="bi bi-person-check"></i></div>
                                    <h2 className="h5">Confirmation</h2>
                                    <p className="mb-0">The company confirms or rejects the booking requests.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
