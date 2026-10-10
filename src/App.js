import React, { useEffect, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { load_UserProfile } from "./actions/userAction";
import The64SquaresBallLoader from "./component/layouts/loader/Loader";
import PrivateRoute from "./component/Route/PrivateRoute";
import { SpeedInsights } from '@vercel/speed-insights/react';
import "./App.css";

import Header from "./component/layouts/Header1.jsx/Header";
import Payment from "./component/Cart/Payment";
import Home from "./component/Home/Home";
import Services from "./Terms&Condtions/Service";
import Footer from "./component/layouts/Footer/Footer";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Signup from "./component/User/SignUp";
import Login from "./component/User/Login";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgetPassword from "./component/User/ForgetPassword";
import ResetPassword from "./component/User/ResetPassword";
import Shipping from "./component/Cart/Shipping";
import Cart from "./component/Cart/Cart";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrder from "./component/order/MyOrder";
import ContactForm from "./Terms&Condtions/Contact";
import AboutUsPage from "./Terms&Condtions/Aboutus";
import ReturnPolicyPage from "./Terms&Condtions/Return";
import TermsUse from "./Terms&Condtions/TermsAndUse";
import TermsAndConditions from "./Terms&Condtions/TermsCondtion";
import PrivacyPolicy from "./Terms&Condtions/Privacy";

const LazyDashboard = React.lazy(() => import("./component/Admin/Dashboard"));
const LazyProductList = React.lazy(() => import("./component/Admin/ProductList"));
const LazyOrderList = React.lazy(() => import("./component/Admin/OrderList"));
const LazyUserList = React.lazy(() => import("./component/Admin/UserList"));
const LazyUpdateProduct = React.lazy(() => import("./component/Admin/UpdateProduct"));
const LazyProcessOrder = React.lazy(() => import("./component/Admin/ProcessOrder"));
const LazyUpdateUser = React.lazy(() => import("./component/Admin/UpdateUser"));
const LazyNewProduct = React.lazy(() => import("./component/Admin/NewProduct"));
const LazyCategoryList = React.lazy(() => import("./component/Admin/CategoryList"));
const LazyProductReviews = React.lazy(() => import("./component/Admin/ProductReviews"));
const LazyInquiryList = React.lazy(() => import("./component/Admin/InquiryList"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(load_UserProfile());
  }, [dispatch]);

  return (
    <>
      <SpeedInsights />
      <Suspense fallback={<The64SquaresBallLoader />}>
        <Routes>
          <Route path="/" element={<><Header /><Home /><Services /><Footer /></>} />
          <Route path="/product/:id" element={<><Header /><ProductDetails /><Services /><Footer /></>} />
          <Route path="/products" element={<><Header /><Products /><Services /><Footer /></>} />
          <Route path="/products/:keyword" element={<><Header /><Products /><Services /><Footer /></>} />
          <Route path="/signup" element={<><Header /><Signup /><Services /><Footer /></>} />
          <Route path="/login" element={<><Header /><Login /><Services /><Footer /></>} />
          <Route path="/password/forgot" element={<><Header /><ForgetPassword /><Services /><Footer /></>} />
          <Route path="/password/reset/:token" element={<><Header /><ResetPassword /><Services /><Footer /></>} />
          <Route path="/cart" element={<><Header /><Cart /><Services /><Footer /></>} />
          <Route path="/policy/return" element={<><Header /><ReturnPolicyPage /><Services /><Footer /></>} />
          <Route path="/policy/Terms" element={<><Header /><TermsUse /><Services /><Footer /></>} />
          <Route path="/policy/privacy" element={<><Header /><PrivacyPolicy /><Services /><Footer /></>} />
          <Route path="/terms/conditions" element={<><Header /><TermsAndConditions /><Services /><Footer /></>} />
          <Route path="/contact" element={<><Header /><ContactForm /><Footer /></>} />
          <Route path="/about_us" element={<><Header /><AboutUsPage /><Footer /></>} />

          {/* User Protected Routes */}
          <Route path="/account" element={<><Header /><PrivateRoute><Profile /></PrivateRoute><Services /><Footer /></>} />
          <Route path="/profile/update" element={<><Header /><PrivateRoute><UpdateProfile /></PrivateRoute><Services /><Footer /></>} />
          <Route path="/password/update" element={<><Header /><PrivateRoute><UpdatePassword /></PrivateRoute><Services /><Footer /></>} />
          <Route path="/orders" element={<><Header /><PrivateRoute><MyOrder /></PrivateRoute><Services /><Footer /></>} />
          <Route path="/shipping" element={<><Header /><PrivateRoute><Shipping /></PrivateRoute><Services /><Footer /></>} />
          <Route path="/order/confirm" element={<><Header /><PrivateRoute><ConfirmOrder /></PrivateRoute><Services /><Footer /></>} />
          <Route path="/success" element={<><Header /><PrivateRoute><OrderSuccess /></PrivateRoute><Services /><Footer /></>} />

          {/* Payment Gateway Route (Razorpay & COD) */}
          <Route
            path="/process/payment"
            element={
              <>
                <Header />
                <PrivateRoute>
                  <Payment />
                </PrivateRoute>
                <Footer />
              </>
            }
          />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<PrivateRoute isAdmin={true}><LazyDashboard /></PrivateRoute>} />
          <Route path="/admin/products" element={<PrivateRoute isAdmin={true}><LazyProductList /></PrivateRoute>} />
          <Route path="/admin/product/:id" element={<PrivateRoute isAdmin={true}><LazyUpdateProduct /></PrivateRoute>} />
          <Route path="/admin/categories" element={<PrivateRoute isAdmin={true}><LazyCategoryList /></PrivateRoute>} />
          <Route path="/admin/inquiries" element={<PrivateRoute isAdmin={true}><LazyInquiryList /></PrivateRoute>} />
          <Route path="/admin/reviews" element={<PrivateRoute isAdmin={true}><LazyProductReviews /></PrivateRoute>} />
          <Route path="/admin/orders" element={<PrivateRoute isAdmin={true}><LazyOrderList /></PrivateRoute>} />
          <Route path="/admin/order/:id" element={<PrivateRoute isAdmin={true}><LazyProcessOrder /></PrivateRoute>} />
          <Route path="/admin/new/product" element={<PrivateRoute isAdmin={true}><LazyNewProduct /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute isAdmin={true}><LazyUserList /></PrivateRoute>} />
          <Route path="/admin/user/:id" element={<PrivateRoute isAdmin={true}><LazyUpdateUser /></PrivateRoute>} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
