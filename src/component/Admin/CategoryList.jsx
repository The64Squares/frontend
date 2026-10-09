import React, { useState, useEffect } from "react";
import "./ProductList.css";
import "./AdminOrders.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  clearErrors,
} from "../../actions/categoryAction";
import {
  NEW_CATEGORY_RESET,
  DELETE_CATEGORY_RESET,
} from "../../constants/categoryConstant";
import { useAlert } from "../../context/AlertContext";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";

// Icons
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";

function CategoryList() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, categories, error } = useSelector(
    (state) => state.categoriesData
  );
  const {
    loading: opLoading,
    success: createSuccess,
    isDeleted,
    error: opError,
  } = useSelector((state) => state.categoryOperation);

  const [toggle, setToggle] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleHandler = () => {
    setToggle(!toggle);
  };

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
    if (opError) {
      alert.error(opError);
      dispatch(clearErrors());
    }
    if (createSuccess) {
      alert.success("New category added successfully!");
      setName("");
      setDescription("");
      setShowAddForm(false);
      dispatch({ type: NEW_CATEGORY_RESET });
      dispatch(getAllCategories());
    }
    if (isDeleted) {
      alert.success("Category deleted successfully!");
      dispatch({ type: DELETE_CATEGORY_RESET });
      dispatch(getAllCategories());
    }
    dispatch(getAllCategories());
  }, [dispatch, alert, error, opError, createSuccess, isDeleted]);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert.error("Please enter a category name");
      return;
    }
    dispatch(createCategory({ name: name.trim(), description: description.trim() }));
  };

  const handleDeleteCategory = (id, catName) => {
    if (
      window.confirm(
        `Are you sure you want to delete category "${catName}"? Existing products with this category will remain, but the category option will be removed.`
      )
    ) {
      dispatch(deleteCategory(id));
    }
  };

  const filteredCategories = (categories || []).filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = cat.name ? cat.name.toLowerCase().includes(q) : false;
    const descMatch = cat.description ? cat.description.toLowerCase().includes(q) : false;
    return nameMatch || descMatch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "Default Collection";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <MetaData title="Category Management — Admin Console" />

      <div className="product-list" style={{ marginTop: 0 }}>
        <div className={!toggle ? "listSidebar" : "toggleBox"}>
          <Sidebar />
        </div>

        <div className="list-table">
          <Navbar toggleHandler={toggleHandler} />

          <div className="admin-orders-inner" style={{ padding: "0.5rem 0 3rem" }}>
            {/* Header */}
            <div className="admin-page-header">
              <div className="admin-page-title-wrap">
                <span className="admin-page-subtag">Catalogue Architecture</span>
                <h1 className="admin-page-title">Category Management</h1>
              </div>

              <button
                type="button"
                className="status-update-btn"
                style={{ width: "auto", padding: "0.75rem 1.35rem", display: "inline-flex", gap: "0.5rem" }}
                onClick={() => setShowAddForm((prev) => !prev)}
              >
                <AddCircleOutlineIcon style={{ fontSize: "1.1rem" }} />
                {showAddForm ? "Close Form" : "Add New Category"}
              </button>
            </div>

            {/* Quick Stat Bar */}
            <div className="admin-orders-stats-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              <div className="admin-stat-card">
                <div className="stat-icon-wrap amber">
                  <CategoryOutlinedIcon fontSize="small" />
                </div>
                <div className="stat-meta">
                  <span className="stat-label">Active Categories</span>
                  <span className="stat-value">{categories ? categories.length : 0}</span>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon-wrap emerald">
                  <LayersOutlinedIcon fontSize="small" />
                </div>
                <div className="stat-meta">
                  <span className="stat-label">Catalogue Taxonomy</span>
                  <span className="stat-value" style={{ fontSize: "1.1rem" }}>Grandmaster Standards</span>
                </div>
              </div>
            </div>

            {/* Collapsible / Floating Add Category Card */}
            {showAddForm && (
              <div
                className="process-card"
                style={{
                  marginBottom: "2rem",
                  background: "#ffffff",
                  border: "1px solid rgba(197, 168, 128, 0.4)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.06)",
                }}
              >
                <h3 className="process-card-title">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    <AddCircleOutlineIcon style={{ color: "#c5a880", fontSize: "1.2rem" }} />
                    Create New Product Category
                  </span>
                </h3>

                <form onSubmit={handleCreateCategory} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <label
                      htmlFor="cat-name-input"
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#71717a",
                        marginBottom: "0.45rem",
                      }}
                    >
                      Category Title *
                    </label>
                    <input
                      id="cat-name-input"
                      type="text"
                      className="status-select-input"
                      placeholder="e.g. Travel Chess Sets, Electronic Sensory Boards..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cat-desc-input"
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#71717a",
                        marginBottom: "0.45rem",
                      }}
                    >
                      Description / Curator Notes (Optional)
                    </label>
                    <textarea
                      id="cat-desc-input"
                      className="status-select-input"
                      rows={3}
                      placeholder="Short summary of this collection or materials used..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ resize: "vertical", fontFamily: "inherit" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="filter-tab-pill"
                      onClick={() => setShowAddForm(false)}
                      style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="status-update-btn"
                      style={{ width: "auto", minWidth: "160px" }}
                      disabled={opLoading || !name.trim()}
                    >
                      {opLoading ? "Saving..." : "Save Category"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Toolbar Card */}
            <div className="admin-toolbar-card">
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#18181b" }}>
                Current Storefront Categories ({filteredCategories.length})
              </span>

              <div className="search-input-wrap">
                <SearchIcon style={{ color: "#71717a", fontSize: "1.1rem" }} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories Table */}
            {loading ? (
              <div style={{ padding: "4rem", textAlign: "center" }}>
                <Loader />
              </div>
            ) : (
              <div className="admin-table-card">
                {filteredCategories.length === 0 ? (
                  <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#71717a" }}>
                    <CategoryOutlinedIcon style={{ fontSize: "3rem", color: "#d4d4d8", marginBottom: "0.5rem" }} />
                    <h3 style={{ margin: "0.25rem 0", color: "#18181b", fontWeight: 600 }}>
                      No categories found
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                      Click "Add New Category" above to create your first custom taxonomy.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="admin-orders-table">
                      <thead>
                        <tr>
                          <th>Category Name</th>
                          <th>Description</th>
                          <th>Created Date</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCategories.map((cat) => (
                          <tr key={cat._id || cat.name}>
                            {/* Category Name */}
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    backgroundColor: "#f4f4f5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#09090b",
                                  }}
                                >
                                  <CategoryOutlinedIcon style={{ fontSize: "1.1rem" }} />
                                </div>
                                <span style={{ fontWeight: 700, color: "#09090b", fontSize: "0.92rem" }}>
                                  {cat.name}
                                </span>
                              </div>
                            </td>

                            {/* Description */}
                            <td style={{ color: "#71717a", fontSize: "0.85rem", maxWidth: "320px" }}>
                              {cat.description || "Active store category taxonomy"}
                            </td>

                            {/* Date */}
                            <td style={{ color: "#52525b", fontSize: "0.84rem" }}>
                              {formatDate(cat.createdAt)}
                            </td>

                            {/* Actions */}
                            <td>
                              <div className="order-table-actions" style={{ justifyContent: "flex-end" }}>
                                <button
                                  type="button"
                                  className="order-table-btn delete"
                                  onClick={() => handleDeleteCategory(cat._id, cat.name)}
                                  title={`Remove category "${cat.name}"`}
                                >
                                  <DeleteOutlineIcon style={{ fontSize: "1.1rem" }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryList;
