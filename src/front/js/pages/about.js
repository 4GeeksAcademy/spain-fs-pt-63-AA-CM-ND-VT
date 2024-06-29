import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import "../../styles/about.css";

export const About = () => {
    const { store, actions } = useContext(Context);

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dszc6zmjd'
        }
    });

    return (
        <div className="text-center mt-2">
            <section className="py-5">
                <div className="container px-3 my-3">
                    <h2 className="fw-bolder text-dark mb-4">About the Project</h2>
                    <p className="lead fw-normal text-dark-50 mb-4">
                        Our platform allows users to register as either clients or companies. Clients can book hairdressing services at their preferred time and date, which companies can then confirm or reject. This system ensures a seamless and efficient booking process for both clients and hairdressing businesses.
                    </p>
                </div>
            </section>
            <section className="mt-2 py-5">
                <div className="container px-3">
                    <h2 className="fw-bolder text-dark mb-4">Meet Our Team</h2>
                    <div className="row gx-5">
                        <div className="col-12 col-md-4 mb-5 text-center">
                            <AdvancedImage cldImg={cld.image('i4mlhsipvrzdolh24ly2')} className="img-fluid small-img mb-3" alt="Adrián Alarcón" />
                            <h5 className="fw-bolder">Adrián Alarcón</h5>
                        </div>
                        <div className="col-12 col-md-4 mb-5 text-center">
                            <AdvancedImage cldImg={cld.image('i4mlhsipvrzdolh24ly2')} className="img-fluid small-img mb-3" alt="Nacho Diez Lacruz" />
                            <h5 className="fw-bolder">Nacho Diez Lacruz </h5>
                        </div>
                        <div className="col-12 col-md-4 mb-5 text-center">
                            <AdvancedImage cldImg={cld.image('i4mlhsipvrzdolh24ly2')} className="img-fluid small-img mb-3" alt="Vanessa Taylor" />
                            <h5 className="fw-bolder">Vanessa Taylor</h5>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
