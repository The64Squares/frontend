import React, { useState } from "react";
import axios from "axios";
import { useAlert } from "../context/AlertContext";
import MetaData from "../component/layouts/MataData/MataData";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "./Contact.css";

const ContactForm = () => {
  const alert = useAlert();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Custom Board / Bespoke Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert.error("Please fill in your name, email, and message.");
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post("/api/v1/inquiry/new", formData, config);

      if (data.success) {
        setSubmitted(true);
        alert.success(
          "Thank you for contacting The64Squares. Your inquiry has been registered with our Concierge team."
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "Custom Board / Bespoke Inquiry",
          message: "",
        });
      }
    } catch (error) {
      const errMsg =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to send inquiry. Please try again or reach out via email/phone.";
      alert.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Contact Concierge | The64Squares" />
      <div className="the64squares-contact-page">
        <div className="contact-hero-banner">
          <span className="contact-tag">CLIENT CONCIERGE</span>
          <h1 className="contact-title">Contact The House of The64Squares</h1>
          <p className="contact-sub">
            Whether you have questions regarding bespoke chess boards, artisanal grain selection, custom engravings, or order status, our connoisseur team is at your service.
          </p>
        </div>

        <div className="contact-container">
          {/* Left Column: Direct Contact Details */}
          <div className="contact-info-card">
            <h3 className="card-heading">At Your Service</h3>

            <div className="contact-info-block">
              <span className="info-label">
                <EmailOutlinedIcon sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }} />
                Client Concierge Email
              </span>
              <a href="mailto:Info@the64squares.in" className="info-val info-link">
                Info@the64squares.in
              </a>
            </div>

            <div className="contact-info-block">
              <span className="info-label">
                <PhoneIphoneOutlinedIcon sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }} />
                Direct Telephone / Mobile
              </span>
              <a href="tel:+916378590349" className="info-val info-link">
                +91 63785 90349
              </a>
            </div>

            <div className="contact-info-block">
              <span className="info-label">
                <InstagramIcon sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }} />
                Official Instagram
              </span>
              <a
                href="https://www.instagram.com/the64squares.in?stkn=dHcxYWF5b2ExZHI="
                target="_blank"
                rel="noopener noreferrer"
                className="info-val info-link instagram-highlight"
              >
                @the64squares.in ↗
              </a>
            </div>

            <div className="contact-info-block">
              <span className="info-label">
                <WhatsAppIcon sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }} />
                Instant WhatsApp Support
              </span>
              <a
                href="https://wa.me/916378590349?text=Hello%20The64Squares%2C%20I%20would%20like%20to%20inquire%20about%20a%20chess%20board%20or%20pieces."
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <WhatsAppIcon sx={{ fontSize: 18 }} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="contact-info-block">
              <span className="info-label">
                <AccessTimeOutlinedIcon sx={{ fontSize: 16, verticalAlign: "middle", mr: 0.5 }} />
                Concierge Hours
              </span>
              <p className="info-val">
                Monday – Saturday: 10:00 AM – 7:00 PM IST<br />
                Sunday: Private Consultations by Appointment
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Submission Form */}
          <div className="contact-form-card">
            <h3 className="card-heading">Send an Inquiry</h3>

            {submitted && (
              <div className="contact-success-banner">
                <CheckCircleOutlineIcon sx={{ fontSize: 24, color: "#059669" }} />
                <div>
                  <strong>Inquiry Dispatched to Concierge</strong>
                  <p>Our connoisseurs have received your message and will review it shortly. You can also submit another request below.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form-grid">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Alexander"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="alexander@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Inquiry Topic *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  disabled={loading}
                >
                  <option value="Custom Board / Bespoke Inquiry">Custom Board / Bespoke Inquiry</option>
                  <option value="Artisanal Chess Sets Query">Artisanal Chess Sets Query</option>
                  <option value="Order & Shipping Status">Order & Shipping Status</option>
                  <option value="Wood Care & Restorations">Wood Care & Restorations</option>
                  <option value="Collector Partnerships & Corporate">Collector Partnerships & Corporate</option>
                  <option value="General Inquiries">General Question</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe your inquiry, requested wood specifications, custom engraving, or order details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={loading}
                ></textarea>
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span>Transmitting Inquiry...</span>
                ) : (
                  <>
                    <SendOutlinedIcon sx={{ fontSize: 18, mr: 1, verticalAlign: "middle" }} />
                    <span>Send Inquiry to Concierge</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
