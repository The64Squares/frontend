import React, { useState } from "react";
import "./Reviews.css";
import Rating from "@mui/material/Rating";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

function formatDate(dateString) {
  if (!dateString) return "Recent Patron";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const MyCard = ({ review }) => {
  const [upvotes, setUpvotes] = useState(12);
  const [downvotes, setDownvotes] = useState(2);
  const [userVoted, setUserVoted] = useState(null); // 'up' | 'down' | null

  const handleVote = (type) => {
    if (userVoted === type) {
      // Toggle off
      if (type === "up") setUpvotes((v) => v - 1);
      if (type === "down") setDownvotes((v) => v - 1);
      setUserVoted(null);
    } else {
      if (type === "up") {
        setUpvotes((v) => v + 1);
        if (userVoted === "down") setDownvotes((v) => v - 1);
      } else {
        setDownvotes((v) => v + 1);
        if (userVoted === "up") setUpvotes((v) => v - 1);
      }
      setUserVoted(type);
    }
  };

  const ratingVal = review.ratings !== undefined ? Number(review.ratings) : 5;

  return (
    <div className="review-item-card">
      <div>
        <div className="review-card-header">
          <div className="review-avatar-wrap">
            <img
              src={
                review.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  review.name || "Client"
                )}`
              }
              alt={review.name}
            />
          </div>

          <div className="review-author-meta">
            <span className="review-author-name">
              {review.name}
              <span className="verified-buyer-tag">
                <VerifiedOutlinedIcon sx={{ fontSize: 13 }} />
                Verified Patron
              </span>
            </span>
            <span className="review-date-txt">
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        <div style={{ margin: "1rem 0 0.65rem 0" }}>
          <Rating
            value={ratingVal}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              color: "#c5a880",
              "& .MuiRating-iconEmpty": { color: "#e4e4e7" },
            }}
          />
        </div>

        {review.title && (
          <h4 className="review-title-txt" style={{ marginBottom: "0.5rem" }}>
            {review.title}
          </h4>
        )}

        <p className="review-comment-body">{review.comment}</p>
      </div>

      <div>
        {review.recommend !== false && (
          <div className="review-recommend-pill" style={{ marginBottom: "1rem" }}>
            <CheckCircleIcon sx={{ fontSize: 16 }} />
            <span>Recommends this acquisition</span>
          </div>
        )}

        <div className="review-footer-actions">
          <span className="review-helpful-label">Was this feedback helpful?</span>
          <div className="review-helpful-btns">
            <button
              type="button"
              className={`helpful-toggle-btn ${
                userVoted === "up" ? "active" : ""
              }`}
              onClick={() => handleVote("up")}
            >
              {userVoted === "up" ? (
                <ThumbUpIcon sx={{ fontSize: 14 }} />
              ) : (
                <ThumbUpOutlinedIcon sx={{ fontSize: 14 }} />
              )}
              <span>{upvotes}</span>
            </button>

            <button
              type="button"
              className={`helpful-toggle-btn ${
                userVoted === "down" ? "active" : ""
              }`}
              onClick={() => handleVote("down")}
            >
              {userVoted === "down" ? (
                <ThumbDownIcon sx={{ fontSize: 14 }} />
              ) : (
                <ThumbDownOutlinedIcon sx={{ fontSize: 14 }} />
              )}
              <span>{downvotes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCard;
