import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/signup.css";
import Swal from "sweetalert2";

const Signin = () => {
  const { actions } = useContext(Context);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    rol: "",
    companyName: "",
    location: ""
  });
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = () => {
    if (formData.password.length < 8) {
      Swal.fire({
        title: "Password Error",
        text: "Password must be at least 8 characters long.",
        icon: "error",
        iconColor: "#f5e556",
        confirmButtonColor: "#f5e556"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: "Password Error",
        text: "Passwords do not match.",
        icon: "error",
        iconColor: "#f5e556",
        confirmButtonColor: "#f5e556"
      });
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validatePassword()) {
      return;
    }

    const { email, password, name, rol, companyName, location } = formData;
    let success;
    if (rol === "client") {
      success = await actions.signup(email, password, name, rol);
    } else if (rol === "company") {
      success = await actions.signupCompany(email, password, name, rol, companyName, location);
    }
    if (success) navigate("/login");
  };

  const handleRoleSelection = (role) => {
    setFormData({ ...formData, rol: role });
    setStep(2);
  };

  return (
    <div className="container text-center mt-5 me-2 ms-2">
      <h1>Signup</h1>
      {step === 1 && (
        <div className="row justify-content-around mt-4 d-flex">
          <div className="card col-sm-4 col-10 m-3 signCards" onClick={() => handleRoleSelection("client")}>
            <div className="card-body">
              <h5 className="card-title">Client</h5>
              <p className="card-text">
                Sign up as a client to access our services tailored for individual needs.
              </p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
            </div>
          </div>
          <div className="card col-sm-4 col-10 m-3 signCards" onClick={() => handleRoleSelection("company")}>
            <div className="card-body">
              <h5 className="card-title">Company</h5>
              <p className="card-text">
                Sign up as a company to access our business solutions and services.
              </p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-building-fill" viewBox="0 0 16 16">
                <path d="M3 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V16h3a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zm1 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5M4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5m2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
              </svg>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="card mx-auto m-4 p-4 w-75 companyCardSign">
          <div className="card-body">
            <h5 className="card-title mb-4">Complete the form</h5>
            <div className="form-group mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {formData.rol === "company" && (
              <>
                <div className="form-group mb-3">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    placeholder="Enter company location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <button className="btn btn-outline-primary m-2 col-sm-3" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="btn btn-outline-primary m-2 col-sm-3" onClick={handleSignup}>
              Signup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
