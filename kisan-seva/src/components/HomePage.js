import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const featuresRef = useRef([]);
  const statsRef = useRef([]);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    featuresRef.current.forEach((ref) => ref && observer.observe(ref));
    statsRef.current.forEach((ref) => ref && observer.observe(ref));

    return () => observer.disconnect();
  }, []);

  const createParticles = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push(
        <div
          key={i}
          className="particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 2}px`,
            height: `${Math.random() * 10 + 2}px`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 10 + 10}s`
          }}
        />
      );
    }
    return particles;
  };

  return (
    <div className="homepage">
      <header className="hero-section">
        {createParticles()}
        <h1>Welcome to UdyaanKalana</h1>
        <p>Empowering Farmers, Connecting Communities</p>
        <div className="cta-buttons">
          <button onClick={() => navigate('/login')} className="cta-btn farmer-btn">
            👨‍🌾 Login as Farmer
          </button>
          <button onClick={() => navigate('/login')} className="cta-btn admin-btn">
            👨‍💼 Login as Admin
          </button>
        </div>
      </header>

      <section className="features-section">
        <h2>Why Choose UdyaanKalana?</h2>
        <div className="features-grid">
          {[
            {
              title: "Direct Market Access",
              description: "Connect directly with buyers and eliminate middlemen. Get fair prices for your produce without intermediaries.",
              icon: "🛒"
            },
            {
              title: "Fair Pricing",
              description: "Get the best prices for your produce with transparent pricing. Real-time market rates and competitive bidding.",
              icon: "💰"
            },
            {
              title: "Inventory Management",
              description: "Easily manage your fruit stocks and track requests. Automated inventory updates and smart alerts.",
              icon: "📊"
            }
          ].map((feature, index) => (
            <div
              key={index}
              ref={el => featuresRef.current[index] = el}
              className="feature-card"
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          {[
            { number: "500+", label: "Farmers Registered" },
            { number: "1000+", label: "Transactions Completed" },
            { number: "₹50L+", label: "Value Generated" },
            { number: "95%", label: "Farmer Satisfaction" }
          ].map((stat, index) => (
            <div
              key={index}
              ref={el => statsRef.current[index] = el}
              className="stat"
            >
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;