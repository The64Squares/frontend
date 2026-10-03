import React from "react";
import MetaData from "../component/layouts/MataData/MataData";
import { Link } from "react-router-dom";
import "./Aboutus.css";

const About_UsPage = () => {
  return (
    <>
      <MetaData title="Our Story & Craftsmanship | The64Squares" />
      <div className="the64squares-about-page">
        <div className="about-hero-banner">
          <span className="about-tag">THE HOUSE OF THE64SQUARES</span>
          <h1 className="about-hero-title">64 Squares. Endless Stories.</h1>
          <p className="about-hero-sub">
            Crafting heirloom-quality chess boards and artisanal chess sets for those who honor the heritage of the game.
          </p>
        </div>

        <div className="about-container">
          {/* Section 1: The Origin */}
          <section className="about-section-grid">
            <div className="about-image-col">
              <img
                src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1000&auto=format&fit=crop"
                alt="The64Squares Chess Craftsmanship"
                className="about-img"
              />
            </div>
            <div className="about-text-col">
              <span className="section-sub-tag">OUR ORIGIN</span>
              <h2>Where Architecture Meets The Game</h2>
              <p>
                The64Squares was born from a singular passion: creating chess boards that are as much a piece of fine interior furniture as they are precision instruments for grandmaster play.
              </p>
              <p>
                We believe that a chess board should not be stored in a box when the game concludes. It belongs on a walnut desk, a study library table, or in the center of a living room—inviting conversation and a thoughtful move.
              </p>
            </div>
          </section>

          {/* Section 2: Craftsmanship & Materials */}
          <section className="about-craft-spotlight">
            <div className="text-center">
              <span className="section-sub-tag">UNCOMPROMISING SELECTION</span>
              <h2>Artisanal Woodwork & Precision</h2>
            </div>

            <div className="craft-pillars-grid">
              <div className="pillar-card">
                <h3>Solid Hardwoods</h3>
                <p>
                  Every board is constructed using sustainably harvested Solid American Walnut, Hard Rock Maple, and East Indian Rosewood, selected for grain harmony and density.
                </p>
              </div>

              <div className="pillar-card">
                <h3>Precision Inlay</h3>
                <p>
                  Our 2.25" (57mm) regulation squares are hand-cut and micro-planed to zero tolerance, ensuring seamless gliding of pieces across every rank and file.
                </p>
              </div>

              <div className="pillar-card">
                <h3>Natural Oil Finish</h3>
                <p>
                  We apply multiple coats of hand-rubbed organic satin oil, preserving the tactile natural warmth of real wood without heavy synthetic varnishes.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Call to Action */}
          <section className="about-cta-card">
            <h2>Experience The64Squares Collection</h2>
            <p>Explore our current editions of handcrafted boards, weighted Staunton pieces, and collector sets.</p>
            <div className="about-btn-group">
              <Link to="/products" className="btn-primary-about">
                Explore Products
              </Link>
              <Link to="/contact" className="btn-secondary-about">
                Contact Connoisseurs
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About_UsPage;
