import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { load_UserProfile } from "../../actions/userAction";
import The64SquaresBallLoader from "../layouts/loader/Loader";

function PrivateRoute({ isAdmin, component: Component, children }) {
  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.userData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(load_UserProfile());
  }, [dispatch]);

  if (loading) {
    return <The64SquaresBallLoader />;
  }

  // If the user data failed to load or the user is not authenticated, redirect to the login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If isAdmin is true and the user is not an admin, redirect to the login page
  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return Component ? <Component /> : children;
}

export default PrivateRoute;
