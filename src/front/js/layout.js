import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

import ClientPortal from "./pages/clientportal/clientportal";
import UserBookings from "./pages/clientportal/userbookings";
import UserProfile from "./pages/clientportal/userprofile";

import AdminPortal from "./pages/adminportal/adminportal";
import AdminBookings from "./pages/adminportal/adminbookings";
import AdminServices from "./pages/adminportal/adminservices";
import CompanyProfile from "./pages/adminportal/companyprofile";

import Services from "./pages/services/services";


import Login from "./pages/login";
import Signin from "./pages/signin";
import CompanyView from "./pages/services/companyview.js";


const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<ClientPortal />} path="/clientportal/:user_id" />
                        <Route element={<UserBookings />} path="/userbookings/:user_id" />
                        <Route element={<UserProfile />} path="/userprofile/:user_id" />
                        <Route element={<AdminPortal />} path="/adminportal/:user_id" />
                        <Route element={<AdminBookings />} path="/adminbookings/:user_id" />
                        <Route element={<AdminServices />} path="/adminservices/:user_id" />
                        <Route element={<CompanyProfile />} path="/companyprofile/:user_id" />
                        <Route element={<Services />} path="/services" />
                        <Route element={<CompanyView />} path="/companyview/:company_id" />
                        <Route element={<Signin />} path="/signup" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                     <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
