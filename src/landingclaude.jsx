import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-container">
      <nav className="navbar">
        <div className="logo-container">
          <div className="logo">
            <svg viewBox="0 0 50 50" className="logo-icon">
              <path d="M15 10 L15 40 L25 35 L35 40 L35 10 Z" fill="currentColor"/>
              <rect x="10" y="8" width="30" height="4" rx="2" fill="currentColor"/>
            </svg>
          </div>
          <span className="brand-name">iTask</span>
        </div>
        
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#feature">Feature</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faqs">FAQs</a></li>
        </ul>
        
        <button className="login-btn">Log in</button>
      </nav>

      <main className="hero-content">
        <h1 className="hero-title">
          Your Daily Tasks<br />
          Organized Effortlessly
        </h1>
        <p className="hero-description">
          iTask helps you manage daily tasks, assign teammates, and track progress — All<br />
          in a simple, fast visual workspace.
        </p>
        <button className="cta-btn">Get Started</button>
      </main>

      <div className="floating-dot dot-1"></div>
      <div className="floating-dot dot-2"></div>
    </div>
  );
};

export default HeroSection;