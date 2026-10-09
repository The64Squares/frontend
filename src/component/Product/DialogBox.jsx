import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import { NEW_REVIEW_RESET } from "../../constants/productsConstatns";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import { clearErrors, newReview } from "../../actions/productAction";

const DialogBox = ({ open, handleClose, id }) => {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState(5);
  const [recommend, setRecommend] = useState(true);

  const { success, error } = useSelector((state) => state.addNewReview);

  const dispatch = useDispatch();
  const params = useParams();
  const productId = id || params.id;
  const alert = useAlert();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert.error("Please provide a review headline");
      return;
    }
    if (!comment.trim()) {
      alert.error("Please provide your review feedback");
      return;
    }
    if (!ratings || ratings < 1) {
      alert.error("Please assign a rating score");
      return;
    }

    const myForm = new FormData();
    myForm.set("title", title.trim());
    myForm.set("comment", comment.trim());
    myForm.set("ratings", ratings);
    myForm.set("recommend", recommend);
    myForm.set("productId", productId);

    dispatch(newReview(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Your critique has been successfully recorded!");
      dispatch({ type: NEW_REVIEW_RESET });
      setTitle("");
      setComment("");
      setRatings(5);
      handleClose();
    }
  }, [dispatch, alert, error, success, handleClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: "16px",
          padding: "1rem",
          backgroundColor: "#ffffff",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "0.5rem",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#c5a880",
              textTransform: "uppercase",
              display: "block",
            }}
          >
            PATRON CRITIQUE
          </span>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#09090b",
              margin: "0.2rem 0 0",
            }}
          >
            Appraise This Piece
          </h3>
        </div>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: 20, color: "#71717a" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ paddingTop: "1rem" }}>
        <form onSubmit={handleSubmit} id="review-form">
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.76rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#3f3f46",
                marginBottom: "0.4rem",
              }}
            >
              Overall Rating *
            </label>
            <Rating
              name="ratings"
              value={ratings}
              precision={0.5}
              onChange={(e, newVal) => setRatings(newVal)}
              sx={{
                color: "#c5a880",
                fontSize: "1.8rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.76rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#3f3f46",
                marginBottom: "0.4rem",
              }}
            >
              Headline / Summary *
            </label>
            <input
              type="text"
              placeholder="e.g. Flawless craftsmanship & majestic grain"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shipping-input"
              style={{ width: "100%", boxSizing: "border-box" }}
              required
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.76rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#3f3f46",
                marginBottom: "0.4rem",
              }}
            >
              Detailed Critique *
            </label>
            <textarea
              rows={4}
              placeholder="Share insights on the wood quality, weighting, piece movement, and finish..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="shipping-input"
              style={{
                width: "100%",
                boxSizing: "border-box",
                fontFamily: "inherit",
                resize: "vertical",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                cursor: "pointer",
                userSelect: "none",
                fontSize: "0.88rem",
                color: "#27272a",
              }}
            >
              <input
                type="checkbox"
                checked={recommend}
                onChange={(e) => setRecommend(e.target.checked)}
                className="shipping-checkbox"
              />
              <span>I recommend this piece to fellow collectors & grandmasters</span>
            </label>
          </div>
        </form>
      </DialogContent>

      <DialogActions style={{ padding: "0.75rem 1.5rem 1.25rem" }}>
        <button
          type="button"
          onClick={handleClose}
          style={{
            background: "transparent",
            border: "1px solid rgba(0, 0, 0, 0.14)",
            borderRadius: "8px",
            padding: "0.7rem 1.25rem",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#52525b",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          form="review-form"
          style={{
            background: "#09090b",
            border: "1px solid #09090b",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "0.7rem 1.75rem",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.03em",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#27272a")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#09090b")}
        >
          Submit Appraisal
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
