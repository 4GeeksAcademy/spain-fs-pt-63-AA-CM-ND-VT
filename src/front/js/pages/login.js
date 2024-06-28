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
    <div className="container mt-4">
      <div className="row justify-content-center mt-5">
        <h1 className="text-center mb-5">Login</h1>
        <div className="col-md-8 col-lg-10 loginDiv">
          <div className="text-center">
            {store.token && store.token !== "" && store.token !== undefined ? (
              <p>You are logged in with this token: {store.token}</p>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control mb-2"
                />
                <input
                  type="password"
                  pattern=""
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control mb-2"
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
