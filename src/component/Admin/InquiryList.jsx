import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./ProductList.css";
import "./AdminOrders.css";
import "./InquiryList.css";
import { useAlert } from "../../context/AlertContext";
import MetaData from "../layouts/MataData/MataData";
import The64SquaresBallLoader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";

// Icons
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";

function InquiryList() {
  const alert = useAlert();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    newCount: 0,
    inProgress: 0,
    responded: 0,
  });

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        activeTab === "All"
          ? `/api/v1/admin/inquiries`
          : `/api/v1/admin/inquiries?status=${encodeURIComponent(activeTab)}`;

      const { data } = await axios.get(url);
      if (data.success) {
        setInquiries(data.inquiries || []);
        setStats({
          total: data.totalInquiries || 0,
          newCount: data.newInquiriesCount || 0,
          inProgress: data.inProgressCount || 0,
          responded: data.respondedCount || 0,
        });
      }
    } catch (err) {
      alert.error(
        (err.response && err.response.data && err.response.data.message) ||
          "Failed to fetch customer inquiries"
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab, alert]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Update status handler
  const handleStatusUpdate = async (id, newStatus, notes = "") => {
    setIsUpdating(true);
    try {
      const { data } = await axios.put(`/api/v1/admin/inquiry/${id}`, {
        status: newStatus,
        adminNotes: notes,
      });

      if (data.success) {
        alert.success(`Inquiry marked as ${newStatus}`);
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(data.inquiry);
        }
        fetchInquiries();
      }
    } catch (err) {
      alert.error(
        (err.response && err.response.data && err.response.data.message) ||
          "Failed to update inquiry status"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this customer inquiry?")) {
      return;
    }

    try {
      const { data } = await axios.delete(`/api/v1/admin/inquiry/${id}`);
      if (data.success) {
        alert.success("Inquiry removed successfully");
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(null);
        }
        fetchInquiries();
      }
    } catch (err) {
      alert.error(
        (err.response && err.response.data && err.response.data.message) ||
          "Failed to delete inquiry"
      );
    }
  };

  // Filtered list by search
  const filteredInquiries = inquiries.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.subject && item.subject.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <>
      <MetaData title="Client Inquiries & Concierge Messages | Admin" />
      <div className="admin-page-container">
        <Sidebar />

        <main className="admin-main-content">
          <Navbar />

          <div className="admin-content-inner">
            {/* Page Header */}
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">Customer Inquiries</h1>
                <p className="admin-page-subtitle">
                  Review, respond to, and manage bespoke requests and customer queries from the Contact page.
                </p>
              </div>

              <div className="admin-header-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={fetchInquiries}
                  disabled={loading}
                >
                  Refresh Messages
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="inquiry-metrics-grid">
              <div className="inquiry-metric-card total">
                <div className="metric-icon-wrap">
                  <EmailOutlinedIcon sx={{ fontSize: 24 }} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Total Inquiries</span>
                  <span className="metric-value">{stats.total}</span>
                </div>
              </div>

              <div className="inquiry-metric-card new">
                <div className="metric-icon-wrap">
                  <MarkEmailUnreadOutlinedIcon sx={{ fontSize: 24 }} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">New / Pending</span>
                  <span className="metric-value">{stats.newCount}</span>
                </div>
              </div>

              <div className="inquiry-metric-card progress">
                <div className="metric-icon-wrap">
                  <HourglassEmptyOutlinedIcon sx={{ fontSize: 24 }} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">In Progress</span>
                  <span className="metric-value">{stats.inProgress}</span>
                </div>
              </div>

              <div className="inquiry-metric-card resolved">
                <div className="metric-icon-wrap">
                  <CheckCircleOutlineIcon sx={{ fontSize: 24 }} />
                </div>
                <div className="metric-info">
                  <span className="metric-label">Responded</span>
                  <span className="metric-value">{stats.responded}</span>
                </div>
              </div>
            </div>

            {/* Control Bar: Filter Tabs & Search */}
            <div className="inquiry-control-bar">
              <div className="inquiry-tabs-wrap">
                {["All", "New", "In Progress", "Responded", "Closed"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`inquiry-tab-btn ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                    {tab === "New" && stats.newCount > 0 && (
                      <span className="tab-badge-new">{stats.newCount}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="inquiry-search-wrap">
                <SearchIcon sx={{ color: "#9ca3af", fontSize: 20 }} />
                <input
                  type="text"
                  placeholder="Search customer, email, topic, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Inquiries Table Container */}
            {loading ? (
              <The64SquaresBallLoader />
            ) : filteredInquiries.length === 0 ? (
              <div className="empty-inquiry-state">
                <EmailOutlinedIcon sx={{ fontSize: 50, color: "#d1d5db" }} />
                <h3>No Customer Inquiries Found</h3>
                <p>
                  {searchQuery
                    ? `No queries matched "${searchQuery}". Try clearing search.`
                    : `No inquiries registered under the "${activeTab}" filter.`}
                </p>
              </div>
            ) : (
              <div className="inquiry-table-card">
                <table className="inquiry-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Customer</th>
                      <th>Topic</th>
                      <th>Message Snippet</th>
                      <th>Date Received</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((item) => {
                      const isNew = item.status === "New";
                      return (
                        <tr
                          key={item._id}
                          className={`inquiry-row ${isNew ? "row-highlight-new" : ""}`}
                        >
                          <td>
                            <span className={`status-badge status-${(item.status || "New").toLowerCase().replace(" ", "-")}`}>
                              {item.status || "New"}
                            </span>
                          </td>
                          <td>
                            <div className="customer-info-cell">
                              <strong className="customer-name">{item.name}</strong>
                              <span className="customer-email">{item.email}</span>
                              {item.phone && (
                                <span className="customer-phone">{item.phone}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="topic-badge">{item.subject}</span>
                          </td>
                          <td className="message-cell">
                            <p className="message-snippet" title={item.message}>
                              {item.message}
                            </p>
                          </td>
                          <td className="date-cell">
                            {formatDate(item.createdAt)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="inquiry-action-btns">
                              <button
                                type="button"
                                className="action-view-btn"
                                onClick={() => setSelectedInquiry(item)}
                                title="View & Respond"
                              >
                                <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                                <span>Inspect</span>
                              </button>
                              <button
                                type="button"
                                className="action-delete-btn"
                                onClick={() => handleDelete(item._id)}
                                title="Delete inquiry"
                              >
                                <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Inquiry Detail & Reply Modal */}
      {selectedInquiry && (
        <div className="inquiry-modal-backdrop" onClick={() => setSelectedInquiry(null)}>
          <div
            className="inquiry-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="inquiry-modal-header">
              <div>
                <span className={`status-badge status-${(selectedInquiry.status || "New").toLowerCase().replace(" ", "-")}`}>
                  {selectedInquiry.status || "New"}
                </span>
                <h2 className="modal-inquiry-title">{selectedInquiry.subject}</h2>
                <span className="modal-date-text">
                  Received on {formatDate(selectedInquiry.createdAt)}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedInquiry(null)}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="inquiry-modal-body">
              {/* Client Info Grid */}
              <div className="modal-client-grid">
                <div className="client-meta-box">
                  <span className="meta-label">Client Name</span>
                  <strong className="meta-val">{selectedInquiry.name}</strong>
                </div>

                <div className="client-meta-box">
                  <span className="meta-label">Email Address</span>
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)} - The64Squares Concierge`}
                    className="meta-val meta-link"
                  >
                    {selectedInquiry.email} ↗
                  </a>
                </div>

                {selectedInquiry.phone && (
                  <div className="client-meta-box">
                    <span className="meta-label">Phone / WhatsApp</span>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <a href={`tel:${selectedInquiry.phone}`} className="meta-val meta-link">
                        {selectedInquiry.phone}
                      </a>
                      <a
                        href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(selectedInquiry.name)}%2C%20thank%20you%20for%20contacting%20The64Squares.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-wa-pill"
                        title="Open WhatsApp chat"
                      >
                        <WhatsAppIcon sx={{ fontSize: 14 }} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Inquiry Message Box */}
              <div className="modal-message-box">
                <span className="message-box-title">Client Message</span>
                <p className="message-box-content">{selectedInquiry.message}</p>
              </div>

              {/* Status Update & Quick Action Bar */}
              <div className="modal-management-section">
                <span className="section-title">Update Inquiry Status</span>
                <div className="status-selector-row">
                  {["New", "In Progress", "Responded", "Closed"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`status-btn-option ${selectedInquiry.status === st ? "active" : ""}`}
                      onClick={() => handleStatusUpdate(selectedInquiry._id, st)}
                      disabled={isUpdating}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="inquiry-modal-footer">
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)} - The64Squares Concierge`}
                className="modal-reply-btn"
                onClick={() => {
                  if (selectedInquiry.status === "New") {
                    handleStatusUpdate(selectedInquiry._id, "In Progress");
                  }
                }}
              >
                <ReplyOutlinedIcon sx={{ fontSize: 18 }} />
                <span>Launch Email Reply</span>
              </a>

              {selectedInquiry.phone && (
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="modal-call-btn"
                >
                  <PhoneOutlinedIcon sx={{ fontSize: 18 }} />
                  <span>Call Client</span>
                </a>
              )}

              <button
                type="button"
                className="modal-done-btn"
                onClick={() => setSelectedInquiry(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InquiryList;
