import React from "react";
import { makeStyles } from "@mui/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";

const useStyles = makeStyles((theme) => ({
  itemCard: {
    display: "flex",
    alignItems: "center",
    padding: "1.25rem 1.5rem",
    backgroundColor: "#ffffff",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      borderColor: "rgba(0, 0, 0, 0.16)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
    },
    [theme.breakpoints.down(640)]: {
      padding: "1rem",
      flexDirection: "column",
      alignItems: "stretch",
      gap: "1rem",
    },
  },
  thumbWrap: {
    width: "100px",
    height: "100px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    backgroundColor: "#f4f4f5",
    flexShrink: 0,
    marginRight: "1.5rem",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
    },
    "&:hover img": {
      transform: "scale(1.05)",
    },
    [theme.breakpoints.down(640)]: {
      width: "100%",
      height: "140px",
      marginRight: 0,
    },
  },
  itemBody: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "0.5rem",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
  },
  titleLink: {
    fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#09090b",
    textDecoration: "none",
    lineHeight: 1.3,
    "&:hover": {
      color: "#c5a880",
    },
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#71717a",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#09090b",
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.5rem",
    gap: "1rem",
  },
  qtyStepper: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    borderRadius: "8px",
    backgroundColor: "#fcfcfd",
    overflow: "hidden",
  },
  stepperBtn: {
    width: "32px",
    height: "32px",
    background: "transparent",
    border: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#27272a",
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.06)",
    },
    "&:disabled": {
      opacity: 0.35,
      cursor: "not-allowed",
    },
  },
  qtyDisplay: {
    minWidth: "34px",
    textAlign: "center",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#09090b",
    userSelect: "none",
  },
  pricingWrap: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.75rem",
  },
  unitPrice: {
    fontSize: "0.86rem",
    color: "#71717a",
  },
  lineTotal: {
    fontFamily: "var(--font-sans, sans-serif)",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#09090b",
  },
}));

function CartItem({
  deleteCartItems,
  item,
  decreaseQuantity,
  increaseQuantity,
  id,
}) {
  const classes = useStyles();
  const unitPrice = item.price;
  const total = unitPrice * item.quantity;

  return (
    <div className={classes.itemCard}>
      <Link to={`/product/${id || item.productId}`} className={classes.thumbWrap}>
        <img src={item.image} alt={item.name} />
      </Link>

      <div className={classes.itemBody}>
        <div className={classes.headerRow}>
          <Link
            to={`/product/${id || item.productId}`}
            className={classes.titleLink}
          >
            {item.name}
          </Link>

          <button
            type="button"
            className={classes.deleteBtn}
            onClick={() => deleteCartItems(id || item.productId)}
            title="Remove piece"
            aria-label="Remove item"
          >
            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <div className={classes.metaRow}>
          <div className={classes.qtyStepper}>
            <button
              type="button"
              className={classes.stepperBtn}
              onClick={() => decreaseQuantity(id || item.productId, item.quantity)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <RemoveIcon sx={{ fontSize: 16 }} />
            </button>

            <span className={classes.qtyDisplay}>{item.quantity}</span>

            <button
              type="button"
              className={classes.stepperBtn}
              onClick={() =>
                increaseQuantity(id || item.productId, item.quantity, item.stock)
              }
              disabled={item.stock <= item.quantity}
              aria-label="Increase quantity"
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </button>
          </div>

          <div className={classes.pricingWrap}>
            <span className={classes.unitPrice}>
              {dispalyMoney(unitPrice)} each
            </span>
            <span className={classes.lineTotal}>
              {dispalyMoney(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
