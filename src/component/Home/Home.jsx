import React, { useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard";
import MataData from "../layouts/MataData/MataData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "../../context/AlertContext";
import HeroMotion from "./HeroMotion";
import { Link } from "react-router-dom";

function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MataData title="The64Squares | Premium Chess Boards & Artisanal Chess Sets" />
          <main className="the64squares-home">
            {/* Apple-Style Motion Hero Showcase */}
            <HeroMotion />

            {/* Brand Philosophy Banner */}
            <section className="home-philosophy-section">
              <div className="section-container">
                <span className="section-tagline">THE ART OF CHESS</span>
                <h2 className="philosophy-title">"64 Squares. Endless Stories."</h2>
                <p className="philosophy-desc">
                  Every square millimeter of a The64Squares board is meticulously hand-joined, planed, and oil-rubbed by master artisans. Designed to elevate both grandmaster play and interior elegance.
                </p>
                <div className="philosophy-features">
                  <div className="feature-item">
                    <span className="feature-icon">🪵</span>
                    <h4>Heirloom Woods</h4>
                    <p>Solid Walnut, American Maple, & Premium Mahogany</p>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">♟️</span>
                    <h4>Weighted Precision</h4>
                    <p>FIDE-compliant triple-weighted Staunton design</p>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✨</span>
                    <h4>Hand-Satin Finish</h4>
                    <p>Natural organic oil sealant for perpetual sheen</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Collection Grid */}
            <section className="home-products-section">
              <div className="section-container">
                <div className="section-header">
                  <div>
                    <span className="section-tagline">CURATED SELECTION</span>
                    <h2 className="section-title">Featured Chess Masterpieces</h2>
                  </div>
                  <Link to="/products" className="section-view-all">
                    View Entire Collection &rarr;
                  </Link>
                </div>

                <div className="products-grid">
                  {products && products.length > 0 ? (
                    products.slice(0, 8).map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                  ) : (
                    <div className="no-products-placeholder">
                      <p>Exploring artisanal collections...</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Editorial Craftsmanship Spotlight */}
            <section className="home-craftsmanship-section">
              <div className="craftsmanship-content">
                <span className="craft-tag">ARTISANAL HERITAGE</span>
                <h2 className="craft-title">Crafted for the Game. Designed for the Room.</h2>
                <p className="craft-text">
                  A chess board should not be stowed away in a closet after checkmate. Our pieces are conceived as functional architectural sculptures that bring warmth, history, and gravitas to modern living spaces.
                </p>
                <div className="craft-stats">
                  <div className="craft-stat-box">
                    <span className="stat-num">2.25"</span>
                    <span className="stat-label">Official FIDE Square Size</span>
                  </div>
                  <div className="craft-stat-box">
                    <span className="stat-num">100%</span>
                    <span className="stat-label">Solid Hardwood Construction</span>
                  </div>
                </div>
                <Link to="/about_us" className="craft-cta-btn">
                  Read Our Story
                </Link>
              </div>
              <div className="craftsmanship-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=1200&auto=format&fit=crop"
                  alt="Chess Craftsmanship Detail"
                  className="craft-image"
                />
              </div>
            </section>

            {/* Connoisseur Testimonials */}
            <section className="home-testimonials-section">
              <div className="section-container text-center">
                <span className="section-tagline">CONNOISSEUR REVIEWS</span>
                <h2 className="section-title">What Chess Lovers Say</h2>
                <div className="testimonials-grid">
                  <div className="testimonial-card">
                    <div className="stars">★★★★★</div>
                    <p className="testimonial-quote">
                      "The weight and grain of the Walnut board is extraordinary. It sits on my library desk and invites a game every single day."
                    </p>
                    <span className="testimonial-author">— Marcus V., Grandmaster Collector</span>
                  </div>
                  <div className="testimonial-card">
                    <div className="stars">★★★★★</div>
                    <p className="testimonial-quote">
                      "Impeccable craftsmanship. The weighted brass pieces feel substantial in hand, and the felted bases glide effortlessly."
                    </p>
                    <span className="testimonial-author">— Elena R., FIDE Master</span>
                  </div>
                  <div className="testimonial-card">
                    <div className="stars">★★★★★</div>
                    <p className="testimonial-quote">
                      "Easily the best gift I have ever purchased. The packaging and attention to wood finish details exceeded my expectations."
                    </p>
                    <span className="testimonial-author">— Julian K., Architect</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Closing Call To Action */}
            <section className="home-final-cta-section">
              <div className="section-container text-center">
                <h2 className="final-cta-title">Make Your Next Game Worth Remembering.</h2>
                <p className="final-cta-sub">
                  Explore our collection of handcrafted chess boards, sets, and limited collector editions.
                </p>
                <Link to="/products" className="final-cta-btn">
                  Explore The64Squares Collection
                </Link>
              </div>
            </section>
          </main>
        </>
      )}
    </>
  );
}

export default Home;
