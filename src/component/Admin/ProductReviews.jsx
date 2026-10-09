import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import SearchIcon from "@mui/icons-material/Search";

import { useAlert } from "../../context/AlertContext";
import {
  getAllreviews,
  clearErrors,
  deleteProductReview,
  getAdminProducts,
} from "../../actions/productAction";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import { DELETE_REVIEW_RESET } from "../../constants/productsConstatns";
import "./ProductList.css";
import "./ProductReviews.css";

function ProductReviews() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [toggle, setToggle] = useState(false);
  const [productId, setProductId] = useState("");
  const [customInput, setCustomInput] = useState("");

  const { products } = useSelector((state) => state.products);
  const { error, reviews, loading } = useSelector((state) => state.getAllReview);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteReview
  );

  const toggleHandler = () => {
    setToggle((prev) => !prev);
  };

  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  // Load reviews whenever a valid productId is selected
  useEffect(() => {
    if (productId && productId.length === 24) {
      dispatch(getAllreviews(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      dispatch({ type: DELETE_REVIEW_RESET });
      if (productId) {
        dispatch(getAllreviews(productId));
      }
    }
  }, [dispatch, error, alert, deleteError, isDeleted, productId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toggle]);

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteProductReview(reviewId, productId));
  };

  const handleProductSelectChange = (e) => {
    const selectedId = e.target.value;
    setProductId(selectedId);
    setCustomInput(selectedId);
  };

  const handleCustomSearchSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim().length === 24) {
      setProductId(customInput.trim());
      dispatch(getAllreviews(customInput.trim()));
    } else {
      alert.error("Please enter a valid 24-character Product ID");
    }
  };

  // Find currently selected product info
  const selectedProduct = products?.find((p) => p._id === productId);

  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      minWidth: 200,
      flex: 0.6,
      headerClassName: "column-header",
    },
    {
      field: "user",
      headerName: "Reviewer Name",
      minWidth: 160,
      flex: 0.6,
      headerClassName: "column-header",
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 260,
      flex: 1.2,
      headerClassName: "column-header",
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 130,
      flex: 0.5,
      headerClassName: "column-header",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#d97706", fontWeight: "600" }}>
            <StarIcon style={{ fontSize: "1.1rem", color: "#f59e0b" }} />
            <span>{params.value} / 5</span>
          </div>
        );
      },
    },
    {
      field: "recommend",
      headerName: "Recommend",
      minWidth: 140,
      flex: 0.5,
      headerClassName: "column-header",
      renderCell: (params) => {
        const isRec = params.value === true;
        return (
          <span className={isRec ? "greenColor" : "redColor"}>
            {isRec ? "Recommended" : "Not Recommended"}
          </span>
        );
      },
    },
    {
      field: "actions",
      flex: 0.4,
      headerName: "Actions",
      minWidth: 100,
      headerClassName: "column-header1",
      sortable: false,
      renderCell: (params) => {
        const reviewId = params.row?.id || params.id;
        return (
          <button
            type="button"
            className="table-action-btn delete"
            onClick={() => deleteReviewHandler(reviewId)}
            title="Delete Review"
          >
            <DeleteIcon fontSize="small" />
          </button>
        );
      },
    },
  ];

  const rows = [];
  if (reviews && reviews.length > 0) {
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
        recommend: item.recommend ?? (item.rating >= 3),
      });
    });
  }

  return (
    <>
      <MetaData title="Reviews Management - Admin" />

      <div className="admin-reviews-root">
        <div className={!toggle ? "admin-reviews-sidebar-wrap" : "admin-reviews-sidebar-toggle"}>
          <Sidebar />
        </div>

        <main className="admin-reviews-main">
          <Navbar toggleHandler={toggleHandler} />

          <div className="admin-reviews-header">
            <div>
              <h1 className="admin-reviews-title">Reviews & Accolades</h1>
              <p className="admin-reviews-subtitle">
                Inspect customer ratings, testimonials, and feedback across your catalog.
              </p>
            </div>
          </div>

          {/* Product Selector Card */}
          <section className="admin-reviews-selector-card">
            <div className="admin-reviews-selector-row">
              <div className="admin-reviews-select-group">
                <label className="admin-reviews-label">Select Boutique Product</label>
                <select
                  className="admin-reviews-select"
                  value={productId}
                  onChange={handleProductSelectChange}
                >
                  <option value="">-- Choose a Product from Catalog --</option>
                  {products &&
                    products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                </select>
              </div>

              <div className="admin-reviews-select-group">
                <label className="admin-reviews-label">Or Search by Product ID</label>
                <input
                  type="text"
                  className="admin-reviews-input"
                  placeholder="Paste 24-character Product ID..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="admin-reviews-search-btn"
                onClick={handleCustomSearchSubmit}
              >
                <SearchIcon fontSize="small" />
                <span>Search</span>
              </button>
            </div>

            {selectedProduct && (
              <div className="admin-reviews-product-banner">
                <div>
                  <div className="admin-reviews-product-name">{selectedProduct.name}</div>
                  <div className="admin-reviews-product-meta">
                    Category: {selectedProduct.category} | Price: ₹{selectedProduct.price} | Stock: {selectedProduct.Stock}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#d97706", fontWeight: "700" }}>
                  <StarIcon style={{ color: "#f59e0b", fontSize: "1.2rem" }} />
                  <span>{selectedProduct.ratings?.toFixed(1) || "5.0"} Rating ({selectedProduct.numOfReviews || 0} Reviews)</span>
                </div>
              </div>
            )}
          </section>

          {/* Reviews Table / Empty state */}
          <section className="admin-reviews-results-card">
            {loading ? (
              <Loader />
            ) : rows.length > 0 ? (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableRowSelectionOnClick
                className="productListTable"
                autoHeight
              />
            ) : (
              <div className="admin-reviews-empty">
                <div className="admin-reviews-empty-icon">
                  <RateReviewOutlinedIcon fontSize="large" />
                </div>
                <h3 className="admin-reviews-empty-title">
                  {productId ? "No Customer Reviews Found" : "No Product Selected"}
                </h3>
                <p className="admin-reviews-empty-text">
                  {productId
                    ? "This product currently has no reviews or ratings recorded by customers."
                    : "Select a chess set from the dropdown above to view customer feedback."}
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default ProductReviews;
