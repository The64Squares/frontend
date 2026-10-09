import React, { useEffect, useRef } from "react";
import { SearchOutlined, CloseOutlined } from "@mui/icons-material";
import "./Searchbar.css";

const Search = ({
  handleSearchButtonClick,
  handleCrossButtonClick,
  searchBarActive,
  handleSearchFormSubmit,
  handleSearchInputChange,
  searchValue,
}) => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-focus input when search bar opens
  useEffect(() => {
    if (searchBarActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchBarActive]);

  // Close search bar on Escape key or outside click
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && searchBarActive) {
        handleCrossButtonClick();
      }
    };

    const handleClickOutside = (event) => {
      if (
        searchBarActive &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        handleCrossButtonClick();
      }
    };

    if (searchBarActive) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBarActive, handleCrossButtonClick]);

  return (
    <div className="search-component-root" ref={containerRef}>
      {!searchBarActive ? (
        <button
          type="button"
          className="search-trigger-btn"
          onClick={handleSearchButtonClick}
          aria-label="Search products"
          title="Search"
        >
          <SearchOutlined className="search-trigger-icon" />
        </button>
      ) : (
        <div className="searchbar-expanded-container">
          <button
            type="button"
            className="search-icon-btn"
            onClick={handleSearchFormSubmit}
            aria-label="Submit search"
          >
            <SearchOutlined className="search-input-icon" />
          </button>

          <form onSubmit={handleSearchFormSubmit} className="searchbar-form">
            <input
              ref={inputRef}
              type="text"
              className="searchbar-input"
              placeholder="Search chess boards, pieces, sets..."
              value={searchValue}
              onChange={handleSearchInputChange}
              aria-label="Search query"
            />
          </form>

          <button
            type="button"
            className="search-close-btn"
            onClick={handleCrossButtonClick}
            aria-label="Close search"
            title="Close (Esc)"
          >
            <CloseOutlined className="search-close-icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;

