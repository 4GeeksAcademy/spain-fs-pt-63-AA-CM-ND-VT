import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/signup.css"

const Signin = () => {
  const { actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rol, setRol] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [step, setStep] = useState(1); // step 1 for role selection, step 2 for signup form

  const navigate = useNavigate();

  const handleSignup = async () => {
    let success;
    if (rol === "client") {
      success = await actions.signup(email, password, name, rol);
    } else if (rol === "company") {
      success = await actions.signupCompany(email, password, name, rol, companyName, location);
    }
    if (success) navigate("/login");
  };

  const handleRoleSelection = (role) => {
    setRol(role);
    setStep(2);
  };

  return (
    <div className="container text-center mt-5">
      <h1>Signup</h1>
      {step === 1 && (
        <div className="row justify-content-around mt-4">
          <div className="card col-md-4 p-3" onClick={() => handleRoleSelection("client")}>
            <div className="card-body">
              <h5 className="card-title">Client</h5>
              <p className="card-text">
                Sign up as a client to access our services tailored for individual needs.
              </p>
            </div>
          </div>
          <div className="card col-md-4 p-3" onClick={() => handleRoleSelection("admin")}>
            <div className="card-body">
              <h5 className="card-title">Company</h5>
              <p className="card-text">
                Sign up as a company to access our business solutions and services.
              </p>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="card mx-auto mt-4 p-4" style={{ maxWidth: '500px' }}>
          <div className="card-body">
            <h5 className="card-title mb-4">Complete the form</h5>
            <div className="form-group mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {rol === "company" && (
              <>
                <div className="form-group mb-3">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyName"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    placeholder="Enter company location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </>
            )}
            <button className="btn btn-secondary mr-2" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleSignup}>
              Signup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
