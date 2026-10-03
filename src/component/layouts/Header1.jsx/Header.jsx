import React, { useState, useEffect } from "react";
import ReorderIcon from "@mui/icons-material/Reorder";
import SearchBar from "./Searchbar";
import "./Header.css";
import CartIcon from "./CartIcon";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import ProfileModal from "./ProfileModel";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.userData);

  const [searchBarActive, setSearchBarActive] = useState(false);
  const [sideMenu, setSideMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const isHomePage = location.pathname === "/";
  // On home page, start transparent; on subpages, default to frosted
  const [isPastHero, setIsPastHero] = useState(!isHomePage);

  useEffect(() => {
    if (!isHomePage) {
      setIsPastHero(true);
      return;
    }

    const handleScroll = () => {
      const heroEl = document.querySelector(".hero-motion-container");
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        // The hero motion container occupies 480vh.
        // It finishes when all frames are completed and rect.bottom <= 80px:
        const finished = rect.bottom <= 80;
        setIsPastHero(finished);
      } else {
        setIsPastHero(window.scrollY > 80);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage, location.pathname]);

  const handleSideBarMenu = () => {
    setSideMenu(!sideMenu);
  };

  const handleSearchButtonClick = () => {
    setSearchBarActive(!searchBarActive);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products/${searchValue}`);
    } else {
      navigate("/products");
    }
  };

  const handleCrossButtonClick = () => {
    setSearchValue("");
    setSearchBarActive(!searchBarActive);
  };

  return (
    <>
      <header
        className={`the64squares-header ${isHomePage ? "header-home-fixed" : "header-subpage-sticky"} ${
          isPastHero ? "header-frosted" : "header-transparent"
        }`}
      >
        {/* Top Announcement Bar */}
        <div className="header-announcement-bar">
          <p>Complimentary Worldwide Express Shipping on Orders Over $150 &nbsp;•&nbsp; Handcrafted Chess Masterpieces</p>
        </div>

        {/* Main Header Container */}
        <div className="header-main-container">
          {/* Mobile Menu Icon */}
          <div className="header-mobile-toggle">
            <button
              type="button"
              className="header-mobile-toggle-btn"
              onClick={() => setSideMenu(!sideMenu)}
              aria-label="Open mobile menu"
            >
              <ReorderIcon
                sx={{
                  fontSize: 26,
                  color: "#171717",
                }}
              />
            </button>
          </div>

          {/* Brand Logo */}
          {!searchBarActive && (
            <Link to="/" className="header-brand-logo">
              <img src="/logo.png" alt="THE64SQUARES Logo" className="brand-logo-img" />
              <span className="brand-logo-text">THE64SQUARES</span>
            </Link>
          )}

          {/* Desktop Navigation Links */}
          {!searchBarActive && (
            <nav className="header-nav-menu">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/products">Chess Boards</Link>
                </li>
                <li>
                  <Link to="/products?category=Artisanal+Chess+Sets">Chess Sets</Link>
                </li>
                <li>
                  <Link to="/about_us">Our Story</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </nav>
          )}

          {/* Action Icons: Search, Cart, Account */}
          <div className="header-actions">
            <div className="search-bar-wrapper">
              <SearchBar
                searchBarActive={searchBarActive}
                searchValue={searchValue}
                handleCrossButtonClick={handleCrossButtonClick}
                handleSearchButtonClick={handleSearchButtonClick}
                handleSearchInputChange={handleSearchInputChange}
                handleSearchFormSubmit={handleSearchFormSubmit}
              />
            </div>

            <Link to="/cart" className="header-cart-link" aria-label="Cart">
              <CartIcon />
            </Link>

            <div className="header-profile-wrapper">
              <ProfileModal user={user} isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar rendered at root level */}
      {sideMenu && (
        <Sidebar
          handleSideBarMenu={handleSideBarMenu}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      )}
    </>
  );
}

export default Header;
