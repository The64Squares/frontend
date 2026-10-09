import React, { useState, lazy, Suspense } from "react";
import "./Reviews.css";
import Rating from "@mui/material/Rating";
import The64SquaresBallLoader from "../layouts/loader/Loader";
import MyCard from "./Card";
import { useSelector } from "react-redux";
import { useAlert } from "../../context/AlertContext";
import { useNavigate } from "react-router-dom";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import StarIcon from "@mui/icons-material/Star";

const DialogBox = lazy(() => import("./DialogBox"));

const ReviewCard = ({ product }) => {
  const { isAuthenticated } = useSelector((state) => state.userData);
  const alert = useAlert();
  const navigate = useNavigate();

  const [sortValue, setSortValue] = useState("highest");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (!isAuthenticated) {
      alert.error("Please sign in to share your collector review");
      navigate("/login");
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const reviews = product.reviews ? [...product.reviews] : [];

  // Sorting reviews logic
  const sortedReviews = reviews.sort((a, b) => {
    const rateA = Number(a.ratings || a.rating || 0);
    const rateB = Number(b.ratings || b.rating || 0);
    if (sortValue === "highest") return rateB - rateA;
    if (sortValue === "lowest") return rateA - rateB;
    if (sortValue === "latest")
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortValue === "oldest")
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    return 0;
  });

  const ratingScore = Number(product.ratings || 0).toFixed(1);
  const totalReviewsCount = product.numOfReviews || reviews.length;

  return (
    <section className="reviews-section-root">
      <div className="reviews-container">
        {/* Hero Banner: Title, Rating Score Card, and Action Button */}
        <div className="reviews-hero-banner">
          <div className="reviews-header-info">
            <span className="reviews-sub-tag">PATRON EXPERIENCES</span>
            <h2 className="reviews-main-title">Client Reviews & Critique</h2>
          </div>

          <div className="reviews-score-card">
            <span className="reviews-score-number">{ratingScore}</span>
            <div className="reviews-score-meta">
              <div className="reviews-stars-wrap">
                <Rating
                  value={Number(product.ratings || 0)}
                  precision={0.5}
                  readOnly
                  sx={{
                    color: "#c5a880",
                    "& .MuiRating-iconEmpty": { color: "#e4e4e7" },
                  }}
                />
              </div>
              <span className="reviews-count-txt">
                Based on {totalReviewsCount} verified{" "}
                {totalReviewsCount === 1 ? "appraisal" : "appraisals"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="write-review-btn"
            onClick={handleClickOpen}
          >
            <RateReviewOutlinedIcon sx={{ fontSize: 18 }} />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Modal Dialog for Submitting Review */}
        <Suspense fallback={<The64SquaresBallLoader />}>
          <DialogBox open={open} handleClose={handleClose} id={product._id} />
        </Suspense>

        {/* Toolbar: Count & Sort */}
        <div className="reviews-toolbar">
          <span className="reviews-showing-count">
            Showing {sortedReviews.length} client{" "}
            {sortedReviews.length === 1 ? "review" : "reviews"}
          </span>

          <div className="reviews-sort-wrap">
            <label htmlFor="review-sort" className="reviews-sort-label">
              Sort By:
            </label>
            <select
              id="review-sort"
              className="reviews-sort-select"
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
            >
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="latest">Latest Reviews</option>
              <option value="oldest">Oldest Reviews</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid or Empty State */}
        {sortedReviews.length === 0 ? (
          <div className="reviews-empty-state">
            <h3>No Appraisals Yet</h3>
            <p>
              Be the first discerning collector to share your critique and
              feedback on this artisanal piece.
            </p>
            <button
              type="button"
              className="write-review-btn"
              onClick={handleClickOpen}
            >
              <RateReviewOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Submit First Review</span>
            </button>
          </div>
        ) : (
          <div className="reviews-grid">
            {sortedReviews.map((review, idx) => (
              <MyCard key={review._id || idx} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewCard;
