import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/login.css";

const Login = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    actions.syncToken();
    if (store.token && store.token !== "" && store.token !== undefined) {
      navigate("/");
    }
  }, [store.token]);

  const handleOnClick = async () => {
    const success = await actions.login(email, password);
    if (success) navigate("/");
  };

  return (
    <div className=" d-flex justify-content-center">
      <div className="login-container">
        <h1 className="text-center mb-4 mt-4">Login</h1>
        <div className="loginDiv">
          <div className="text-center">
            {store.token && store.token !== "" && store.token !== undefined ? (
              <p>You are logged in with this token: {store.token}</p>
            ) : (
              <div>
                <h6>Please, enter your email and password.</h6>
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control mb-2 form-controlwid "
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control mb-2 form-controlwid "
                />
                <button onClick={handleOnClick} className="btn btn-outline-primary btnwid">
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
