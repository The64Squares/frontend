import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import Rating from "@mui/material/Rating";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import useActive from "../hook/useActive";
import ReviewCard from "./ReviewCard";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import { useAlert } from "../../context/AlertContext";
import MetaData from "../layouts/MataData/MataData";
import { addItemToCart } from "../../actions/cartAction";
import Loader from "../layouts/loader/Loader";
import Button from "@mui/material/Button";
import { PRODUCT_DETAILS_RESET } from "../../constants/productsConstatns";
import {
  generateDiscountedPrice,
  calculateDiscount,
  dispalyMoney,
} from "../DisplayMoney/DisplayMoney";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const [quantity, setQuantity] = useState(1);
  const [previewImg, setPreviewImg] = useState("");
  const { handleActive, activeClass } = useActive(0);

  const { product, loading, error, success } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success && product && product.images && product.images.length > 0) {
      setPreviewImg(product.images[0].url);
      handleActive(0);
      dispatch({ type: PRODUCT_DETAILS_RESET });
    }
    dispatch(getProductDetails(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, alert, success, id]);

  const handleAddItem = () => {
    dispatch(addItemToCart(id, quantity));
    alert.success("Added to your shopping bag");
  };

  const handlePreviewImg = (images, i) => {
    setPreviewImg(images[i].url);
    handleActive(i);
  };

  function increaseQuantityHandler() {
    if (product.Stock <= quantity) return;
    setQuantity((prev) => prev + 1);
  }

  function decreaseQuantityHandler() {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  }

  const finalPrice = product ? generateDiscountedPrice(product.price) : 0;
  const discountedPrice = product ? product.price - finalPrice : 0;
  const newPrice = dispalyMoney(finalPrice);
  const oldPrice = dispalyMoney(product ? product.price : 0);
  const savedPrice = dispalyMoney(discountedPrice);
  const savedDiscount = product ? calculateDiscount(discountedPrice, product.price) : 0;

  return (
    <>
      {loading || !product ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${product.name} | The64Squares`} />
          <div className="the64squares-details-page">
            <div className="details-container">
              {/* Left Column: Gallery */}
              <div className="details-gallery-col">
                <div className="details-thumbnails-list">
                  {product.images &&
                    product.images.map((img, i) => (
                      <div
                        key={i}
                        className={`thumbnail-item ${activeClass(i)}`}
                        onClick={() => handlePreviewImg(product.images, i)}
                      >
                        <img src={img.url} alt={`${product.name} thumbnail ${i + 1}`} />
                      </div>
                    ))}
                </div>
                <figure className="details-main-image-wrapper">
                  <img src={previewImg || (product.images && product.images[0]?.url)} alt={product.name} className="details-main-image" />
                </figure>
              </div>

              {/* Right Column: Info & Action */}
              <div className="details-info-col">
                <span className="details-category-tag">{product.category || "ARTISANAL EDITION"}</span>
                <h1 className="details-product-title">{product.name}</h1>

                <div className="details-rating-row">
                  <Rating
                    value={Number(product.ratings || 5)}
                    precision={0.5}
                    readOnly
                    sx={{ color: "#8A6A43", fontSize: "1rem" }}
                  />
                  <span className="rating-divider">•</span>
                  <span className="rating-count-text">{product.numOfReviews || 0} Customer Reviews</span>
                </div>

                <div className="details-price-box">
                  <div className="price-display">
                    <span className="current-price">{newPrice}</span>
                    {oldPrice !== newPrice && (
                      <span className="original-price">{oldPrice}</span>
                    )}
                  </div>
                  {savedDiscount > 0 && (
                    <span className="savings-badge">Save {savedPrice} ({savedDiscount}%)</span>
                  )}
                </div>

                <div className="details-divider"></div>

                <p className="details-description">{product.description}</p>

                {/* Craftsmanship Specs Table */}
                <div className="details-specs-box">
                  <h4 className="specs-title">Product Specifications</h4>
                  <div className="specs-grid">
                    <div className="spec-row">
                      <span className="spec-label">Material</span>
                      <span className="spec-val">{product.info || "Solid American Walnut & Maple"}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Square Size</span>
                      <span className="spec-val">2.25" (57 mm) FIDE Regulation</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Finish</span>
                      <span className="spec-val">Hand-Rubbed Organic Satin Oil</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Availability</span>
                      <span className="spec-val">
                        {product.Stock >= 1 ? (
                          <span className="stock-in"><DoneIcon sx={{ fontSize: 14 }} /> In Stock ({product.Stock} available)</span>
                        ) : (
                          <span className="stock-out"><CloseIcon sx={{ fontSize: 14 }} /> Made to Order</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="details-divider"></div>

                {/* Quantity & Add to Cart */}
                <div className="details-action-row">
                  <div className="quantity-picker">
                    <IconButton onClick={decreaseQuantityHandler} className="qty-btn">
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <span className="qty-val">{quantity}</span>
                    <IconButton onClick={increaseQuantityHandler} className="qty-btn">
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </div>

                  <Button
                    className="add-to-cart-cta"
                    onClick={handleAddItem}
                    disabled={product.Stock <= 0}
                  >
                    Add to Cart • {dispalyMoney(finalPrice * quantity)}
                  </Button>
                </div>

                {/* Assurance Badges */}
                <div className="details-assurance-list">
                  <div className="assurance-item">
                    <LocalShippingOutlinedIcon sx={{ color: "#8A6A43" }} />
                    <span>Complimentary Express Worldwide Delivery</span>
                  </div>
                  <div className="assurance-item">
                    <SecurityOutlinedIcon sx={{ color: "#8A6A43" }} />
                    <span>Lifetime Hardwood Warranty Against Warping</span>
                  </div>
                  <div className="assurance-item">
                    <WorkspacePremiumOutlinedIcon sx={{ color: "#8A6A43" }} />
                    <span>Includes Certificate of Authenticity</span>
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
