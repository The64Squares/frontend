import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../component/Admin/Dashboard";
import ProductList from "../component/Admin/ProductList";
import OrderList from "../component/Admin/OrderList";
import UserList from "../component/Admin/UserList";
import UpdateProduct from "../component/Admin/UpdateProduct";
import ProcessOrder from "../component/Admin/ProcessOrder";
import UpdateUser from "../component/Admin/UpdateUser";
import NewProduct from "../component/Admin/NewProduct";
import CategoryList from "../component/Admin/CategoryList";
import ProductReviews from "../component/Admin/ProductReviews";
import PrivateRoute from "../component/Route/PrivateRoute";

const Admin = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<PrivateRoute isAdmin={true}><Dashboard /></PrivateRoute>} />
      <Route path="/admin/products" element={<PrivateRoute isAdmin={true}><ProductList /></PrivateRoute>} />
      <Route path="/admin/product/:id" element={<PrivateRoute isAdmin={true}><UpdateProduct /></PrivateRoute>} />
      <Route path="/admin/categories" element={<PrivateRoute isAdmin={true}><CategoryList /></PrivateRoute>} />
      <Route path="/admin/reviews" element={<PrivateRoute isAdmin={true}><ProductReviews /></PrivateRoute>} />
      <Route path="/admin/orders" element={<PrivateRoute isAdmin={true}><OrderList /></PrivateRoute>} />
      <Route path="/admin/order/:id" element={<PrivateRoute isAdmin={true}><ProcessOrder /></PrivateRoute>} />
      <Route path="/admin/new/product" element={<PrivateRoute isAdmin={true}><NewProduct /></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute isAdmin={true}><UserList /></PrivateRoute>} />
      <Route path="/admin/user/:id" element={<PrivateRoute isAdmin={true}><UpdateUser /></PrivateRoute>} />
    </Routes>
  );
};

export default Admin;