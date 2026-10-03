import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "./HeroSlider.css";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1600&auto=format&fit=crop",
    quote: "THE GAME BEGINS WITH THE BOARD",
    title: "Handcrafted Heirloom Chess Boards in Solid Walnut & Maple",
    buttonText: "Explore Chess Boards",
    link: "/products",
  },
  {
    image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=1600&auto=format&fit=crop",
    quote: "64 SQUARES. ENDLESS STORIES.",
    title: "Artisanal Chess Sets Crafted for Connoisseurs & Collectors",
    buttonText: "Discover Chess Sets",
    link: "/products?category=Artisanal+Chess+Sets",
  },
  {
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1600&auto=format&fit=crop",
    quote: "CRAFTSMANSHIP BEYOND COMPROMISE",
    title: "Weighted Rosewood & Triple-Weighted Brass Masterpieces",
    buttonText: "View Collector Editions",
    link: "/products?category=Collector+Editions",
  },
];

export default function HeroSlider() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="hero-carousel-wrapper">
      <Carousel
        autoPlay={true}
        indicators={true}
        animation="fade"
        duration={800}
        interval={6000}
        cycleNavigation={true}
        navButtonsAlwaysVisible={true}
        index={activeStep}
        onChangeIndex={setActiveStep}
        className="hero-carousel"
        indicatorIconButtonProps={{
          style: {
            color: "rgba(255, 255, 255, 0.4)",
            padding: "4px",
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            color: "#8A6A43",
          },
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="hero-slide-container">
            <div className="hero-slide-overlay"></div>
            <img
              src={slide.image}
              alt="The64Squares Chess Collection"
              className="hero-slide-image"
            />
            <div className="hero-slide-content">
              <span className="hero-slide-tag">{slide.quote}</span>
              <h1 className="hero-slide-title">{slide.title}</h1>
              <div className="hero-cta-group">
                <Link to={slide.link}>
                  <Button className="hero-primary-btn">
                    {slide.buttonText}
                  </Button>
                </Link>
                <Link to="/about_us">
                  <Button className="hero-secondary-btn">
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
