import React from "react";
import "./Loader.css";

const The64SquaresLoader = () => (
  <div className="chess-loader-container">
    <div className="chess-loader-logo-wrapper">
      <img src="/logo.png" alt="Loading THE64SQUARES" className="chess-loader-logo" />
      <div className="chess-loader-ring"></div>
    </div>
    <span className="loader-brand-text">THE64SQUARES</span>
  </div>
);

export default The64SquaresLoader;
