import React, { useEffect } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import MetaData from "../layouts/MataData/MataData";
import CheckoutSteps from "./CheckoutSteps ";
import { emptyCart } from "../../actions/cartAction";

function OrderSuccess() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(emptyCart());
    sessionStorage.removeItem("orderInfo");
  }, [dispatch]);
  return (
    <div
      style={{
        backgroundColor: "#f8f9fb",
        minHeight: "100vh",
        padding: "3rem 1.5rem 5rem",
        boxSizing: "border-box",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      }}
    >
      <MetaData title="Order Confirmed | The64Squares" />
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <CheckoutSteps activeStep={3} />

        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: "16px",
            padding: "4rem 2.5rem",
            textAlign: "center",
            marginTop: "2.5rem",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 44, color: "#059669" }} />
          </div>

          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: "#c5a880",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            ACQUISITION SECURED
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "#09090b",
              margin: "0 0 0.85rem 0",
              letterSpacing: "-0.01em",
            }}
          >
            Your Order Has Been Placed
          </h1>

          <p
            style={{
              color: "#71717a",
              fontSize: "0.98rem",
              maxWidth: "520px",
              lineHeight: 1.6,
              margin: "0 0 2.5rem 0",
            }}
          >
            Thank you for patronizing The 64 Squares. Our artisans will meticulously
            inspect, polish, and crate your heirloom chess pieces with insured express dispatch.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              to="/orders"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.65rem",
                backgroundColor: "#09090b",
                color: "#ffffff",
                padding: "0.95rem 2.25rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: "10px",
                transition: "all 0.25s ease",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#09090b")}
            >
              <span>View Your Orders</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </Link>

            <Link
              to="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.65rem",
                backgroundColor: "#ffffff",
                color: "#18181b",
                border: "1px solid rgba(0, 0, 0, 0.14)",
                padding: "0.95rem 2rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: "10px",
                transition: "all 0.25s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f5")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
