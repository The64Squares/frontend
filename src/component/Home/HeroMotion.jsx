import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./HeroMotion.css";

const TOTAL_FRAMES = 150;
const FRAME_BG_COLOR = "#CFCBCE"; // Matches the exact 3D render studio background

const getFramePath = (index) => {
  const pad = String(index + 1).padStart(3, "0");
  return `/hero-frames/ezgif-frame-${pad}.jpg`;
};

const CHAPTERS = [
  {
    id: "intro",
    title: "Sculpted for the Mind.",
    subtitle: "Crafted for the Room.",
    eyebrow: "THE 64 SQUARES • MASTERPIECE COLLECTION",
    desc: "Experience the anatomy, rotational balance, and artisanal weight of museum-grade Staunton chessmen. Turned from solid African ebony and weighted for instinctive grandmaster play.",
    specs: ["Museum Grade", "Solid African Ebony", "FIDE Regulation"],
    fadeIn: 0.0,
    solidIn: 0.0,
    solidOut: 0.08,
    fadeOut: 0.14,
    jumpProgress: 0.0,
    icon: "♟",
    position: "left",
    isIntro: true,
  },
  {
    id: "knight",
    title: "The Knight",
    subtitle: "Unorthodox. Lethal. Instinctive.",
    eyebrow: "01 / ARCHITECTURAL COMBAT",
    desc: "Hand-carved from solid African ebony with an ergonomic weighted core. Sculpted with aggressive crest lines and instinctive tactile balance for grandmaster maneuverability.",
    specs: ["Triple-Weighted (3.8 oz)", "Hand-Carved Mane", "Solid Ebony"],
    fadeIn: 0.14,
    solidIn: 0.20,
    solidOut: 0.35,
    fadeOut: 0.40,
    jumpProgress: 0.25,
    icon: "♞",
    position: "left",
  },
  {
    id: "bishop",
    title: "The Bishop",
    subtitle: "Diagonal Mastery Across 64 Squares.",
    eyebrow: "02 / LONG-RANGE PRECISION",
    desc: "Lathe-turned to 0.05mm tolerances. Featuring an authentic hand-cut miter and weighted base calibrated for authoritative acoustic resonance on tournament maple.",
    specs: ["Hand-Cut Miter", "0.05mm Precision", "Acoustic Resonance"],
    fadeIn: 0.40,
    solidIn: 0.45,
    solidOut: 0.62,
    fadeOut: 0.68,
    jumpProgress: 0.52,
    icon: "♝",
    position: "right",
  },
  {
    id: "rook",
    title: "The Rook",
    subtitle: "The Unyielding Cornerstone.",
    eyebrow: "03 / FORTIFIED FOUNDATION",
    desc: "Milled with micro-crenellated parapets and weighted billiard-cloth felt. Built with massive structural authority to anchor open files and command the endgame.",
    specs: ["Milled Parapets", "Green Baize Felt", "Endgame Anchor"],
    fadeIn: 0.68,
    solidIn: 0.72,
    solidOut: 0.84,
    fadeOut: 0.88,
    jumpProgress: 0.78,
    icon: "♜",
    position: "left",
  },
  {
    id: "craft",
    title: "Mastery in Every Cut",
    subtitle: "Heirloom Chessmen for Connoisseurs.",
    eyebrow: "04 / UNCOMPROMISING FINISH",
    desc: "Every curve undergoes multi-stage hand sanding and organic walnut oil sealant, bringing out the deep natural luster of museum-grade hardwoods.",
    specs: ["Organic Oil Finish", "FIDE Specification", "Certificate of Authenticity"],
    fadeIn: 0.88,
    solidIn: 0.92,
    solidOut: 1.0,
    fadeOut: 1.0,
    jumpProgress: 0.96,
    icon: "♔",
    position: "left",
    hasCta: true,
  },
];

export default function HeroMotion() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES));
  const rafRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);

  const [loadedCount, setLoadedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Retrieve cached frame or closest loaded neighbor
  const getClosestFrame = useCallback((index) => {
    const images = imagesRef.current;
    if (images[index]?.complete && images[index]?.naturalWidth > 0) {
      return images[index];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = index - offset;
      if (prev >= 0 && images[prev]?.complete && images[prev]?.naturalWidth > 0) {
        return images[prev];
      }
      const next = index + offset;
      if (next < TOTAL_FRAMES && images[next]?.complete && images[next]?.naturalWidth > 0) {
        return images[next];
      }
    }
    return null;
  }, []);

  // Render high-definition frame covering the full hero section edge-to-edge
  const renderFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = getClosestFrame(frameIdx);
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;

    // Fill seamless studio background
    ctx.fillStyle = FRAME_BG_COLOR;
    ctx.fillRect(0, 0, cw, ch);

    // Full-bleed cover scaling: fills the entire screen edge-to-edge
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;

    const isPortrait = cw < ch;
    let offsetX;
    let offsetY;

    if (isPortrait) {
      // In portrait (mobile/tablet), center on the piece focal point (~60% across the 1920 frame)
      const pieceFocalX = img.naturalWidth * 0.60;
      offsetX = (cw / 2) - (pieceFocalX * scale);
      // Elevate the piece slightly into the top portion of the screen above the docked story card
      offsetY = (ch - drawH) / 2 - (ch * 0.07);
    } else {
      // Desktop / Landscape: Center across the entire viewport
      offsetX = (cw - drawW) / 2;
      offsetY = (ch - drawH) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, offsetX, offsetY, drawW, drawH);
    lastDrawnFrameRef.current = frameIdx;
  }, [getClosestFrame]);

  // Adjust canvas resolution for Retina displays without CSS distortion
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayW = window.innerWidth;
    const displayH = window.innerHeight;

    const targetW = Math.round(displayW * dpr);
    const targetH = Math.round(displayH * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    renderFrame(lastDrawnFrameRef.current >= 0 ? lastDrawnFrameRef.current : 0);
  }, [renderFrame]);

  // Preload all 150 frames with keyframe priority
  useEffect(() => {
    let isMounted = true;
    let loaded = 0;

    const onImageLoaded = () => {
      if (!isMounted) return;
      loaded++;
      setLoadedCount(loaded);
      if (loaded === 1 || lastDrawnFrameRef.current === -1) {
        resizeCanvas();
        renderFrame(0);
      }
    };

    const loadImage = (idx) => {
      if (imagesRef.current[idx]) return;
      const img = new Image();
      img.onload = onImageLoaded;
      img.onerror = onImageLoaded;
      img.src = getFramePath(idx);
      imagesRef.current[idx] = img;
      if (img.complete && img.naturalWidth > 0) {
        onImageLoaded();
      }
    };

    // Priority 1: First frame
    loadImage(0);

    // Priority 2: Act Keyframes
    const keyframes = [15, 37, 50, 72, 90, 119, 135, 149];
    keyframes.forEach((kf) => loadImage(kf));

    // Priority 3: Remaining frames
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      if (!keyframes.includes(i)) {
        loadImage(i);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [renderFrame, resizeCanvas]);

  // Continuous animation loop with Apple-style momentum dampening (LERP)
  useEffect(() => {
    let animationFrameId;

    const updateLoop = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * 0.18; // Smooth momentum interpolation
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(currentProgressRef.current * (TOTAL_FRAMES - 1)))
      );

      if (frameIdx !== lastDrawnFrameRef.current) {
        renderFrame(frameIdx);
      }

      setScrollProgress(currentProgressRef.current);
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [renderFrame]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      const currentScrolled = -rect.top;
      let progress = currentScrolled / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));

      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    handleScroll();
    resizeCanvas();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

  // Smooth jump to progress
  const scrollToProgress = (targetProgress) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerTop + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  // Card opacity curve calculator
  const getCardOpacity = (chapter) => {
    if (scrollProgress < chapter.fadeIn || scrollProgress > chapter.fadeOut) {
      return 0;
    }
    if (scrollProgress >= chapter.solidIn && scrollProgress <= chapter.solidOut) {
      return 1;
    }
    if (scrollProgress < chapter.solidIn) {
      return (scrollProgress - chapter.fadeIn) / (chapter.solidIn - chapter.fadeIn);
    }
    return 1 - (scrollProgress - chapter.solidOut) / (chapter.fadeOut - chapter.solidOut);
  };

  // Identify active chapter for HUD
  const getActiveChapterIndex = () => {
    if (scrollProgress < 0.14) return 0;
    if (scrollProgress < 0.40) return 1;
    if (scrollProgress < 0.68) return 2;
    if (scrollProgress < 0.88) return 3;
    return 4;
  };

  const activeChapterIndex = getActiveChapterIndex();

  return (
    <section className="hero-motion-container" ref={containerRef} aria-label="Interactive Chess Motion Showcase">
      <div className="hero-motion-sticky">
        {/* Pixel-perfect Retina Canvas (no CSS stretch, initialized with native screen resolution) */}
        <canvas
          ref={canvasRef}
          className="hero-motion-canvas"
          width={typeof window !== "undefined" ? Math.round(window.innerWidth * Math.min(window.devicePixelRatio || 1, 2)) : 1920}
          height={typeof window !== "undefined" ? Math.round(window.innerHeight * Math.min(window.devicePixelRatio || 1, 2)) : 1080}
        />

        {/* Floating Storytelling Overlay Stage */}
        <div className="hero-motion-stage">
          <div className="hero-motion-stage-inner">
            {CHAPTERS.map((chapter) => {
              const opacity = getCardOpacity(chapter);
              if (opacity <= 0.01) return null;

              const translateY = (1 - opacity) * 16;

              return (
                <article
                  key={chapter.id}
                  className={`hero-story-card position-${chapter.position} ${chapter.isIntro ? "hero-intro-card" : ""}`}
                  style={{
                    opacity,
                    "--card-anim-y": `${translateY}px`,
                    pointerEvents: opacity > 0.25 ? "auto" : "none",
                  }}
                >
                  <span className="story-eyebrow">{chapter.eyebrow}</span>
                  <div className="story-title-row">
                    <span className="story-icon-emblem">{chapter.icon}</span>
                    <h1 className="story-title">{chapter.title}</h1>
                  </div>
                  <h2 className="story-subtitle">{chapter.subtitle}</h2>
                  <p className="story-desc">{chapter.desc}</p>

                  <div className="story-specs-row">
                    {chapter.specs.map((spec, i) => (
                      <span key={i} className="story-spec-chip">
                        {spec}
                      </span>
                    ))}
                  </div>

                  {chapter.isIntro && (
                    <button
                      type="button"
                      className="hero-scroll-cta"
                      onClick={() => scrollToProgress(0.25)}
                      aria-label="Scroll to explore motion"
                    >
                      <span className="scroll-pill-small">
                        <span className="scroll-dot-small" />
                      </span>
                      <span>Scroll to scrub motion</span>
                    </button>
                  )}

                  {chapter.hasCta && (
                    <div className="story-cta-group">
                      <Link to="/products">
                        <Button className="story-primary-btn">
                          Explore Collection
                        </Button>
                      </Link>
                      <Link to="/about_us">
                        <Button className="story-secondary-btn">
                          Our Craft Story
                        </Button>
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Minimalist Apple-Style Chapter Indicator */}
        <nav className="hero-motion-hud" aria-label="Chapter Scrub Navigation">
          {CHAPTERS.slice(1).map((ch, idx) => (
            <button
              key={ch.id}
              type="button"
              className={`hud-item ${activeChapterIndex === idx + 1 ? "active" : ""}`}
              onClick={() => scrollToProgress(ch.jumpProgress)}
              aria-label={`Jump to ${ch.title}`}
            >
              <span className="hud-label">{ch.title}</span>
              <div className="hud-indicator">{ch.icon}</div>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
