import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useAlert } from "../../context/AlertContext";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import { createProduct, clearErrors } from "../../actions/productAction";
import { getAllCategories } from "../../actions/categoryAction";
import { NEW_PRODUCT_RESET } from "../../constants/productsConstatns";
import "./NewProduct.css";

const DEFAULT_CATEGORIES = [
  "Artisanal Chess Sets",
  "Premium Chess Boards",
  "Luxury Wood Sets",
  "Weighted Chess Pieces",
  "Tournament Boards",
  "Collector Editions",
  "Chess Accessories",
];

function NewProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const fileInputRef = useRef();

  const { loading, error, success } = useSelector((state) => state.addNewProduct);
  const { categories: dynamicCategories } = useSelector(
    (state) => state.categoriesData
  );

  const categories =
    dynamicCategories && dynamicCategories.length > 0
      ? dynamicCategories.map((c) => c.name)
      : DEFAULT_CATEGORIES;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState("");
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [toggle, setToggle] = useState(false);

  const toggleHandler = () => {
    setToggle((prev) => !prev);
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toggle]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");
      navigate("/admin/products");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, navigate, success]);

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setImagesPreview((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert.error("Please enter a product name");
      return;
    }
    if (!category) {
      alert.error("Please select a category");
      return;
    }
    if (!price || Number(price) <= 0) {
      alert.error("Please enter a valid price");
      return;
    }
    if (images.length === 0) {
      alert.error("Please upload at least one image");
      return;
    }

    const productData = {
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      category,
      Stock: Number(Stock) || 0,
      info: info && info.trim() ? info.trim() : name.trim(),
      images,
    };

    dispatch(createProduct(productData));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Craft New Product - Admin" />

          <div className="admin-editor-root">
            <div className={!toggle ? "admin-editor-sidebar-wrap" : "admin-editor-sidebar-toggle"}>
              <Sidebar />
            </div>

            <main className="admin-editor-main">
              <Navbar toggleHandler={toggleHandler} />

              <div className="admin-editor-header">
                <div>
                  <h1 className="admin-editor-title">Craft New Product</h1>
                  <p className="admin-editor-subtitle">
                    Publish an artisanal chess masterpiece to the catalog with high-resolution imagery.
                  </p>
                </div>
              </div>

              <form
                className="admin-editor-form"
                encType="multipart/form-data"
                onSubmit={createProductSubmitHandler}
              >
                {/* 1. Essential Details Card */}
                <div className="admin-editor-card">
                  <div className="admin-editor-card-header">
                    <h2 className="admin-editor-card-title">Product Details</h2>
                    <p className="admin-editor-card-desc">
                      Core catalog attributes, pricing, and stock inventory.
                    </p>
                  </div>

                  <div className="admin-editor-grid">
                    <div className="admin-form-group full-width">
                      <label className="admin-form-label">Product Name *</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="e.g. The Zagreb 1959 Grandmaster Artisan Set"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label className="admin-form-label" style={{ margin: 0 }}>Category *</label>
                        <Link
                          to="/admin/categories"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "0.74rem", color: "#c5a880", textDecoration: "none", fontWeight: 600 }}
                        >
                          + Manage Categories
                        </Link>
                      </div>
                      <select
                        className="admin-form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="">Select a Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Price (INR ₹) *</label>
                      <input
                        type="number"
                        min="0"
                        className="admin-form-input"
                        placeholder="e.g. 14999"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Stock Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        className="admin-form-input"
                        placeholder="e.g. 15"
                        value={Stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Subtitle / Key Highlight</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="e.g. Hand-carved in Bud Rosewood & Boxwood (4.0'' King)"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Detailed Description Card */}
                <div className="admin-editor-card">
                  <div className="admin-editor-card-header">
                    <h2 className="admin-editor-card-title">Story & Specifications</h2>
                    <p className="admin-editor-card-desc">
                      Provide a compelling description of the chess pieces, craftsmanship, and materials.
                    </p>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Detailed Description *</label>
                    <textarea
                      className="admin-form-textarea"
                      placeholder="Describe the historical heritage, weight distribution, lacquer finish, board dimensions, and collectible value..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* 3. Product Photography Card */}
                <div className="admin-editor-card">
                  <div className="admin-editor-card-header">
                    <h2 className="admin-editor-card-title">Product Imagery</h2>
                    <p className="admin-editor-card-desc">
                      Upload high-resolution photography showcasing the chess set from multiple angles.
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImagesChange}
                  />

                  <div
                    className="admin-upload-dropzone"
                    onClick={handleImageUploadClick}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="admin-upload-icon-wrap">
                      <CloudUploadOutlinedIcon fontSize="large" />
                    </div>
                    <p className="admin-upload-prompt">
                      Click to browse or drop images here
                    </p>
                    <p className="admin-upload-help">
                      High-quality JPEG, PNG, or WEBP (Multiple images supported)
                    </p>
                  </div>

                  {imagesPreview.length > 0 && (
                    <div className="admin-previews-grid">
                      {imagesPreview.map((img, index) => (
                        <div key={index} className="admin-preview-item">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="admin-preview-img"
                          />
                          <button
                            type="button"
                            className="admin-preview-remove"
                            onClick={() => removeImage(index)}
                            title="Remove image"
                          >
                            <CloseIcon style={{ fontSize: "14px" }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="admin-editor-actions">
                  <Link to="/admin/products" className="admin-btn-cancel">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="admin-btn-publish"
                    disabled={loading}
                  >
                    <AddCircleOutlineIcon fontSize="small" />
                    <span>Publish Product to Boutique</span>
                  </button>
                </div>
              </form>
            </main>
          </div>
        </>
      )}
    </>
  );
}

export default NewProduct;
