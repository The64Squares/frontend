import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";
import "./Footer.css";

const footMenu = [
  {
    id: 1,
    title: "Collection",
    menu: [
      { id: 1, link: "Chess Boards", path: "/products" },
      { id: 2, link: "Artisanal Chess Sets", path: "/products?category=Artisanal+Chess+Sets" },
      { id: 3, link: "Luxury Wood Sets", path: "/products?category=Luxury+Wood+Sets" },
      { id: 4, link: "Weighted Chess Pieces", path: "/products?category=Weighted+Chess+Pieces" },
      { id: 5, link: "Tournament Boards", path: "/products?category=Tournament+Boards" },
    ],
  },
  {
    id: 2,
    title: "Support & Care",
    menu: [
      { id: 1, link: "Care & Maintenance", path: "/policy/Terms" },
      { id: 2, link: "Shipping & Delivery", path: "/policy/return" },
      { id: 3, link: "Returns & Exchanges", path: "/policy/return" },
      { id: 4, link: "Privacy Policy", path: "/policy/privacy" },
      { id: 5, link: "Terms of Service", path: "/terms/conditions" },
    ],
  },
  {
    id: 3,
    title: "The House",
    menu: [
      { id: 1, link: "Our Story", path: "/about_us" },
      { id: 2, link: "Craftsmanship", path: "/about_us" },
      { id: 3, link: "Contact Connoisseurs", path: "/contact" },
      { id: 4, link: "Track Your Order", path: "/orders" },
    ],
  },
];

const Footer = () => {
  const [subValue, setSubValue] = useState("");
  const alert = useAlert();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubValue("");
    alert.success("Welcome to The64Squares. You have successfully subscribed to our newsletter.");
  };

  const currYear = new Date().getFullYear();

  return (
    <footer className="the64squares-footer">
      <div className="footer-top-container">
        {/* Brand Column & Newsletter */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand-logo">
            <img src="/logo.png" alt="THE64SQUARES Logo" className="footer-logo-img" />
            <span className="footer-logo-text">THE64SQUARES</span>
          </Link>
          <p className="footer-brand-desc">
            Crafting heirloom-quality chess boards and artisanal chess sets for players, collectors, and lovers of timeless design.
          </p>

          <div className="footer-newsletter">
            <h5 className="newsletter-title">Receive Curated Editions</h5>
            <p className="newsletter-sub">Subscribe to receive private collection previews & artisanal insights.</p>
            <form onSubmit={handleSubmit} className="footer-form">
              <input
                type="email"
                className="footer-email-input"
                placeholder="Enter your email address"
                required
                value={subValue}
                onChange={(e) => setSubValue(e.target.value)}
              />
              <button type="submit" className="footer-submit-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Menus */}
        <div className="footer-menus-grid">
          {footMenu.map((group) => (
            <div className="footer-menu-col" key={group.id}>
              <h4 className="footer-menu-title">{group.title}</h4>
              <ul className="footer-menu-list">
                {group.menu.map((item) => (
                  <li key={item.id}>
                    <Link to={item.path}>{item.link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-divider"></div>

      {/* Sub-Footer Copyright & Legal */}
      <div className="footer-bottom-container">
        <p className="footer-copyright">
          &copy; {currYear} THE64SQUARES. All Rights Reserved. Crafted for the game. Designed for the room.
        </p>
        <div className="footer-legal-links">
          <Link to="/policy/privacy">Privacy Policy</Link>
          <Link to="/terms/conditions">Terms & Conditions</Link>
          <Link to="/policy/return">Return Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
