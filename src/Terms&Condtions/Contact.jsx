import React, { useState } from "react";
import { useAlert } from "../context/AlertContext";
import { useNavigate } from "react-router-dom";
import MetaData from "../component/layouts/MataData/MataData";
import "./Contact.css";

const ContactForm = () => {
  const alert = useAlert();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Custom Order / Inquiry",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert.success("Thank you for contacting The64Squares. A chess connoisseur specialist will respond shortly.");
    navigate("/");
  };

  return (
    <>
      <MetaData title="Contact Connoisseurs | The64Squares" />
      <div className="the64squares-contact-page">
        <div className="contact-hero-banner">
          <span className="contact-tag">CLIENT CONCIERGE</span>
          <h1 className="contact-title">Contact The House of The64Squares</h1>
          <p className="contact-sub">
            Whether you have questions regarding bespoke chess boards, grain selection, or order tracking, our team is at your service.
          </p>
        </div>

        <div className="contact-container">
          <div className="contact-info-card">
            <h3 className="card-heading">At Your Service</h3>
            
            <div className="contact-info-block">
              <span className="info-label">Client Concierge Email</span>
              <p className="info-val">concierge@the64squares.com</p>
            </div>

            <div className="contact-info-block">
              <span className="info-label">Artisanal Workshop & Studio</span>
              <p className="info-val">
                The64Squares Atelier<br />
                Craftsmen Way, Suite 400<br />
                Woodland Arts District
              </p>
            </div>

            <div className="contact-info-block">
              <span className="info-label">Concierge Hours</span>
              <p className="info-val">
                Monday – Friday: 9:00 AM – 6:00 PM EST<br />
                Saturday: 10:00 AM – 4:00 PM EST
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-card">
            <h3 className="card-heading">Send an Inquiry</h3>
            <form onSubmit={handleSubmit} className="contact-form-grid">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord Alexander"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="alexander@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Inquiry Topic</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Custom Order / Inquiry">Custom Board / Bespoke Inquiry</option>
                  <option value="Order Tracking">Order & Shipping Status</option>
                  <option value="Care & Restorations">Care & Restorations</option>
                  <option value="Collector Partnerships">Collector Partnerships</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe your inquiry or requested board specifications..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
