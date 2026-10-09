import React from "react";
import logoImg from "../../../Image/logo.png";
import "./Loader.css";

const The64SquaresLoader = () => (
  <div className="chess-loader-container">
    <div className="chess-loader-medallion">
      <div className="chess-loader-glow" />
      <div className="chess-loader-track" />
      <div className="chess-loader-arc-outer" />
      <div className="chess-loader-arc-inner" />
      <div className="chess-loader-badge">
        <img
          src={logoImg}
          alt="THE 64 SQUARES"
        />
      </div>
    </div>
    <div className="chess-loader-brand">
      <h3 className="chess-loader-text">The 64 Squares</h3>
      <div className="chess-loader-shimmer-bar" />
    </div>
  </div>
);

export default The64SquaresLoader;
