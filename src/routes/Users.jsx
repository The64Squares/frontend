import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../component/layouts/Header1.jsx/Header";
import Footer from "../component/layouts/Footer/Footer";
import Services from "../component/layouts/Footer/Service";
import Home from "../component/Home/Home";
import ProductDetails from "../component/Product/ProductDetails";
import Products from "../component/Product/Products";
import Shipping from "../component/Cart/Shipping";
import Cart from "../component/Cart/Cart";
import ConfirmOrder from "../component/Cart/ConfirmOrder";
import Payment from "../component/Cart/Payment";
import OrderSuccess from "../component/Cart/OrderSuccess";
import MyOrder from "../component/order/MyOrder";
import ContactForm from "../component/layouts/About/Contact";
import AboutUsPage from "../component/layouts/About/Aboutus";
import ReturnPolicyPage from "../Terms&Condtions/Return";
import TermsUse from "../Terms&Condtions/TermsAndUse";
import TermsAndConditions from "../Terms&Condtions/TermsCondtion";
import PrivacyPolicy from "../Terms&Condtions/Privacy";
import Signup from "../component/User/SignUp";
import Login from "../component/User/Login";
import Profile from "../component/User/Profile";
import PrivateRoute from "../component/Route/PrivateRoute";
import UpdatePassword from "../component/User/UpdatePassword";
import ForgetPassword from "../component/User/ForgetPassword";
import ResetPassword from "../component/User/ResetPassword";
import UpdateProfile from "../component/User/UpdateProfile";
import { useDispatch } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { load_UserProfile } from "../actions/userAction";

function Users() {
  const location = useLocation();
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [stripeApiKey, setStripeApiKey] = useState("");
  const dispatch = useDispatch();

  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      setStripeApiKey(data.stripeApiKey);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setIsAdminRoute(true);
    } else {
      setIsAdminRoute(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    dispatch(load_UserProfile());
    getStripeApiKey();
  }, [dispatch]);

  const stripePromise = stripeApiKey ? loadStripe(stripeApiKey) : null;

  return (
    <>
      {isAdminRoute ? null : <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgetPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/policy/return" element={<ReturnPolicyPage />} />
        <Route path="/policy/Terms" element={<TermsUse />} />
        <Route path="/policy/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms/conditions" element={<TermsAndConditions />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/about_us" element={<AboutUsPage />} />

        <Route path="/account" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/profile/update" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
        <Route path="/password/update" element={<PrivateRoute><UpdatePassword /></PrivateRoute>} />

        <Route path="/orders" element={<PrivateRoute><MyOrder /></PrivateRoute>} />
        <Route path="/shipping" element={<PrivateRoute><Shipping /></PrivateRoute>} />
        <Route path="/order/confirm" element={<PrivateRoute><ConfirmOrder /></PrivateRoute>} />
        <Route path="/success" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />

        {stripePromise && (
          <Route
            path="/process/payment"
            element={
              <Elements stripe={stripePromise}>
                <PrivateRoute><Payment /></PrivateRoute>
              </Elements>
            }
          />
        )}
      </Routes>
      <Services />
      <Footer />
    </>
  );
}

export default Users;