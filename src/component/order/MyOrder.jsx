import React, { useEffect } from "react";
import "./Myorder.css";
import { useSelector, useDispatch } from "react-redux";
import { myOrders, clearErrors } from "../../actions/orderAction";
import MetaData from "../layouts/MataData/MataData";
import The64SquaresBallLoader from "../layouts/loader/Loader";
import { useAlert } from "../../context/AlertContext";
import OrderCard from "./OrderCard";
import { Link } from "react-router-dom";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MyOrder = () => {
  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { orders, loading, error } = useSelector((state) => state.myOrder);
  const { user } = useSelector((state) => state.userData);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, alert, error]);

  return (
    <>
      <MetaData title="My Orders & Acquisitions | The64Squares" />
      {loading ? (
        <The64SquaresBallLoader />
      ) : (
        <div className="orders-page-root">
          <div className="orders-header-banner">
            <span className="orders-sub-tag">CLIENT ARCHIVE</span>
            <h1 className="orders-title">Your Acquisitions</h1>
            <p className="orders-count">
              {orders ? orders.length : 0}{" "}
              {orders && orders.length === 1 ? "Order" : "Orders"} recorded in{" "}
              {currentYear}
            </p>
          </div>

          <div className="orders-main-container">
            {!orders || orders.length === 0 ? (
              <div className="orders-empty-state">
                <div className="orders-empty-icon-ring">
                  <Inventory2OutlinedIcon sx={{ fontSize: 38, color: "#c5a880" }} />
                </div>
                <h2>No Orders in Your Archive</h2>
                <p>
                  You haven't commissioned or ordered any chess pieces yet.
                  Explore our collection of handcrafted tournament sets and
                  heirloom boards.
                </p>
                <Link to="/products" className="orders-explore-btn">
                  <span>Explore Chess Collection</span>
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Link>
              </div>
            ) : (
              orders.map((item) => (
                <OrderCard key={item._id} item={item} user={user} />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrder;
