import React, { useEffect, useState } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "../../context/AlertContext";
import { useParams, useLocation } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { Button } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { getAllCategories } from "../../actions/categoryAction";

const DEFAULT_CATEGORIES = [
  "Premium Chess Boards",
  "Artisanal Chess Sets",
  "Luxury Wood Sets",
  "Weighted Chess Pieces",
  "Tournament Boards",
  "Collector Editions",
  "Chess Accessories",
];

function Products() {
  const { keyword } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const alert = useAlert();

  const {
    products,
    loading,
    productsCount,
    error,
    resultPerPage,
  } = useSelector((state) => state.products);
  const { categories: dynamicCategories } = useSelector(
    (state) => state.categoriesData
  );

  const categories =
    dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories.map((c) => c.name)
      : DEFAULT_CATEGORIES;

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const hasActiveFilters = Boolean(category || ratings > 0 || price[0] > 0 || price[1] < 100000);

  // Parse category from URL search params if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) {
      setCategory(catFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, ratings, category, alert, error]);

  const setCurrentPageNoHandler = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const handleCategoryToggle = (selectedCat) => {
    if (category === selectedCat) {
      setCategory("");
    } else {
      setCategory(selectedCat);
    }
  };

  const handleRatingChange = (event) => {
    setRatings(Number(event.target.value));
  };

  const clearAllFilters = () => {
    setPrice([0, 100000]);
    setCategory("");
    setRatings(0);
    setCurrentPage(1);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Explore Collection | The64Squares" />
          <div className="the64squares-products-page">
            <div className="products-banner">
              <span className="products-banner-tag">HANDCRAFTED EDITIONS</span>
              <h1 className="products-banner-title">
                {category ? category : keyword ? `Search Results for "${keyword}"` : "The Complete Collection"}
              </h1>
              <p className="products-banner-sub">
                Explore heirloom chess boards, solid wood pieces, and regulation tournament equipment.
              </p>
            </div>

            {/* Mobile Filter & Sort Bar */}
            <div className="mobile-filter-toolbar">
              <button
                type="button"
                className={`mobile-filter-toggle-btn ${mobileFiltersOpen ? "is-open" : ""}`}
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                aria-expanded={mobileFiltersOpen}
              >
                <TuneIcon fontSize="small" />
                <span>{mobileFiltersOpen ? "Close Filters" : "Filter & Sort"}</span>
                {hasActiveFilters && <span className="mobile-filter-dot" />}
              </button>
              <span className="mobile-products-count">
                {productsCount || 0} {productsCount === 1 ? "Piece" : "Pieces"}
              </span>
            </div>

            <div className="products-main-layout">
              {/* Sidebar Filters (Collapsible on Mobile, Persistent on Desktop) */}
              <aside className={`products-sidebar-filters ${mobileFiltersOpen ? "mobile-open" : "mobile-collapsed"}`}>
                <div className="mobile-filter-panel-header">
                  <div className="mobile-filter-panel-title">
                    <TuneIcon fontSize="small" sx={{ color: "#8A6A43" }} />
                    <span>Filter & Refine</span>
                  </div>
                  <button
                    type="button"
                    className="mobile-filter-panel-close"
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-label="Close filters"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </div>

                <div className="filter-group">
                  <h3 className="filter-heading">Categories</h3>
                  <ul className="category-filter-list">
                    <li
                      className={`category-item ${category === "" ? "active" : ""}`}
                      onClick={() => setCategory("")}
                    >
                      All Categories
                    </li>
                    {categories.map((cat, index) => (
                      <li
                        key={index}
                        className={`category-item ${category === cat ? "active" : ""}`}
                        onClick={() => handleCategoryToggle(cat)}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="filter-divider"></div>

                <div className="filter-group">
                  <h3 className="filter-heading">Price Range</h3>
                  <div className="price-slider-wrapper">
                    <Slider
                      value={price}
                      onChange={priceHandler}
                      min={0}
                      max={100000}
                      step={500}
                      valueLabelDisplay="auto"
                      sx={{ color: "#8A6A43" }}
                    />
                    <div className="price-range-display">
                      <span>${price[0]}</span>
                      <span>${price[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="filter-divider"></div>

                <div className="filter-group">
                  <h3 className="filter-heading">Customer Rating</h3>
                  <RadioGroup value={String(ratings)} onChange={handleRatingChange}>
                    <FormControlLabel value="4" control={<Radio sx={{ color: "#8A6A43", "&.Mui-checked": { color: "#8A6A43" } }} />} label="4★ & above" />
                    <FormControlLabel value="3" control={<Radio sx={{ color: "#8A6A43", "&.Mui-checked": { color: "#8A6A43" } }} />} label="3★ & above" />
                    <FormControlLabel value="0" control={<Radio sx={{ color: "#8A6A43", "&.Mui-checked": { color: "#8A6A43" } }} />} label="All Ratings" />
                  </RadioGroup>
                </div>

                {hasActiveFilters && (
                  <Button className="clear-filters-btn" onClick={clearAllFilters}>
                    Reset Filters
                  </Button>
                )}

                <div className="mobile-filter-panel-footer">
                  <Button
                    className="mobile-filter-apply-btn"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    View {productsCount || 0} Results
                  </Button>
                </div>
              </aside>

              {/* Products Content */}
              <main className="products-grid-container">
                {products && products.length > 0 ? (
                  <div className="products-grid">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="empty-products-state">
                    <InventoryIcon sx={{ fontSize: 48, color: "#8A6A43" }} />
                    <h2>No Products Found</h2>
                    <p>No chess boards or sets matched your selected criteria.</p>
                    <Button className="reset-btn" onClick={clearAllFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {resultPerPage < productsCount && (
                  <div className="products-pagination-wrapper">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={resultPerPage}
                      totalItemsCount={productsCount}
                      onChange={setCurrentPageNoHandler}
                      nextPageText="Next"
                      prevPageText="Prev"
                      firstPageText="First"
                      lastPageText="Last"
                      itemClass="page-item"
                      linkClass="page-link"
                      activeClass="pageItemActive"
                      activeLinkClass="pageLinkActive"
                    />
                  </div>
                )}
              </main>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Products;
