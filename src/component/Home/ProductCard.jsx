import React from "react";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { generateDiscountedPrice } from "../DisplayMoney/DisplayMoney";
import { addItemToCart } from "../../actions/cartAction";
import { useDispatch } from "react-redux";
import { useAlert } from "../../context/AlertContext";
import { useCurrency } from "../../context/CurrencyContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { formatPrice } = useCurrency();

  const discountPrice = formatPrice(generateDiscountedPrice(product.price));
  const oldPrice = formatPrice(product.price);

  const addTocartHandler = (e, id, qty) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItemToCart(id, qty));
    alert.success("Added to cart");
  };

  const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : "";

  return (
    <div className="the64squares-product-card">
      <Link to={`/product/${product._id}`} className="card-link-wrapper">
        <div className="card-media-wrapper">
          {product.category && (
            <span className="card-category-badge">{product.category}</span>
          )}
          <img src={imageUrl} alt={product.name} className="card-product-image" />
          <button
            className="card-quick-add-btn"
            onClick={(e) => addTocartHandler(e, product._id, 1)}
          >
            Add to Cart
          </button>
        </div>

        <div className="card-content-area">
          <div className="card-rating-row">
            <Rating
              value={Number(product.ratings || 5)}
              precision={0.5}
              readOnly
              size="small"
              sx={{ color: "#8A6A43", fontSize: "0.85rem" }}
            />
            <span className="card-reviews-count">({product.numOfReviews || 0})</span>
          </div>

          <h3 className="card-product-title">{product.name}</h3>

          <div className="card-price-row">
            <span className="card-final-price">{discountPrice}</span>
            {oldPrice && oldPrice !== discountPrice && (
              <span className="card-old-price">{oldPrice}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
