import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import Rating from "@mui/material/Rating";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import ReviewCard from "./ReviewCard";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import { useAlert } from "../../context/AlertContext";
import MetaData from "../layouts/MataData/MataData";
import { addItemToCart } from "../../actions/cartAction";
import The64SquaresBallLoader from "../layouts/loader/Loader";
import { PRODUCT_DETAILS_RESET } from "../../constants/productsConstatns";
import { useCurrency } from "../../context/CurrencyContext";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { formatPrice, currency } = useCurrency();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { product, loading, error, success } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success && product && product.images && product.images.length > 0) {
      setActiveImageIndex(0);
      dispatch({ type: PRODUCT_DETAILS_RESET });
    }
    dispatch(getProductDetails(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, alert, success, id]);

  const images = product?.images && product.images.length > 0
    ? product.images
    : [{ url: "https://i.imgur.com/JSW6mEk.png" }];

  const currentImageUrl = images[activeImageIndex]?.url || images[0]?.url;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddItem = () => {
    dispatch(addItemToCart(id, quantity));
    alert.success("Piece added to your shopping bag");
  };

  const handleBuyNow = () => {
    dispatch(addItemToCart(id, quantity));
    navigate("/shipping");
  };

  const increaseQuantityHandler = () => {
    if (product.Stock <= quantity) {
      alert.error("Maximum available stock reached");
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantityHandler = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };

  // Pure product price (no artificial 35% discount)
  const unitPrice = product ? product.price : 0;
  const lineTotal = unitPrice * quantity;

  return (
    <>
      {loading || !product ? (
        <The64SquaresBallLoader />
      ) : (
        <>
          <MetaData title={`${product.name} | The64Squares`} />
          <div className="the64squares-details-page">
            <div className="details-container">
              {/* Left Column: Image Showcase Gallery */}
              <div className="details-gallery-col">
                {/* Thumbnails list if multiple images exist */}
                {images.length > 1 && (
                  <div className="details-thumbnails-list">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className={`thumbnail-item ${
                          activeImageIndex === i ? "active" : ""
                        }`}
                        onClick={() => setActiveImageIndex(i)}
                      >
                        <img
                          src={img.url}
                          alt={`${product.name} thumbnail ${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Showcase Canvas */}
                <div className="details-main-image-wrapper">
                  <span className="gallery-badge">HANDCRAFTED</span>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="gallery-nav-btn prev"
                        onClick={handlePrevImage}
                        aria-label="Previous view"
                      >
                        <ChevronLeftIcon sx={{ fontSize: 24 }} />
                      </button>
                      <button
                        type="button"
                        className="gallery-nav-btn next"
                        onClick={handleNextImage}
                        aria-label="Next view"
                      >
                        <ChevronRightIcon sx={{ fontSize: 24 }} />
                      </button>
                    </>
                  )}

                  <img
                    src={currentImageUrl}
                    alt={product.name}
                    className="details-main-image"
                  />
                </div>
              </div>

              {/* Right Column: Product Information & Purchase Controls */}
              <div className="details-info-col">
                <span className="details-category-tag">
                  {product.category || "COLLECTOR EDITION"}
                </span>

                <h1 className="details-product-title">{product.name}</h1>

                <div className="details-rating-row">
                  <Rating
                    value={Number(product.ratings || 5)}
                    precision={0.5}
                    readOnly
                    sx={{ color: "#c5a880", fontSize: "1.1rem" }}
                  />
                  <span className="rating-divider">•</span>
                  <span className="rating-count-text">
                    {product.numOfReviews || 0}{" "}
                    {product.numOfReviews === 1
                      ? "Customer Review"
                      : "Customer Reviews"}
                  </span>
                </div>

                {/* Honest Pricing Display */}
                <div className="details-price-box">
                  <span className="current-price">
                    {formatPrice(unitPrice)}
                  </span>
                  <span className="tax-badge-info">
                    {currency === "INR"
                      ? "(Inclusive of all taxes & duties)"
                      : `(All duties included • Converted in ${currency})`}
                  </span>
                </div>

                <p className="details-description">{product.description}</p>

                {/* Detailed Craftsmanship Specifications */}
                <div className="details-specs-card">
                  <h4 className="specs-title">Artisan Specifications</h4>
                  <div className="specs-grid">
                    <div className="spec-row">
                      <span className="spec-label">Artisan Details</span>
                      <span className="spec-val">
                        {product.info || "Hand-carved premium hardwood with weighted felt base"}
                      </span>
                    </div>

                    <div className="spec-row">
                      <span className="spec-label">Standard</span>
                      <span className="spec-val">
                        FIDE Tournament Regulation Sizing
                      </span>
                    </div>

                    <div className="spec-row">
                      <span className="spec-label">Weighting</span>
                      <span className="spec-val">
                        Triple-Weighted (Internal Iron Core)
                      </span>
                    </div>

                    <div className="spec-row">
                      <span className="spec-label">Availability</span>
                      <span className="spec-val">
                        {product.Stock >= 1 ? (
                          <span className="stock-in">
                            <DoneIcon sx={{ fontSize: 16 }} /> In Stock (
                            {product.Stock} available)
                          </span>
                        ) : (
                          <span className="stock-out">
                            <CloseIcon sx={{ fontSize: 16 }} /> Made to Order
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Purchase Action Controls */}
                <div className="details-action-row">
                  {/* Stepper */}
                  <div className="quantity-picker">
                    <button
                      type="button"
                      onClick={decreaseQuantityHandler}
                      className="qty-btn"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <RemoveIcon sx={{ fontSize: 18 }} />
                    </button>
                    <span className="qty-val">{quantity}</span>
                    <button
                      type="button"
                      onClick={increaseQuantityHandler}
                      className="qty-btn"
                      disabled={product.Stock <= quantity}
                      aria-label="Increase quantity"
                    >
                      <AddIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    type="button"
                    className="add-to-cart-cta"
                    onClick={handleAddItem}
                    disabled={product.Stock <= 0}
                  >
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
                    <span>
                      Add to Cart • {formatPrice(lineTotal)}
                    </span>
                  </button>

                  {/* Buy Now Direct Button */}
                  <button
                    type="button"
                    className="buy-now-cta"
                    onClick={handleBuyNow}
                    disabled={product.Stock <= 0}
                  >
                    <BoltIcon sx={{ fontSize: 18 }} />
                    <span>Buy Now</span>
                  </button>
                </div>

                {/* Luxury Brand Guarantees */}
                <div className="details-assurance-list">
                  <div className="assurance-item">
                    <LocalShippingOutlinedIcon sx={{ color: "#c5a880" }} />
                    <span>Complimentary Express Worldwide Insured Dispatch</span>
                  </div>
                  <div className="assurance-item">
                    <SecurityOutlinedIcon sx={{ color: "#c5a880" }} />
                    <span>Lifetime Hardwood Warranty Against Warping</span>
                  </div>
                  <div className="assurance-item">
                    <WorkspacePremiumOutlinedIcon sx={{ color: "#c5a880" }} />
                    <span>Includes Stamped Certificate of Authenticity</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="details-reviews-container">
              <ReviewCard product={product} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
