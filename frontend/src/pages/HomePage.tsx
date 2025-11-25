import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import AdminBus from "../components/adminComponents/AdminBus";
import { LocalHost } from "../components/constants";
import "./home.css";

const featureHighlights = [
  {
    title: "Live bus tracking",
    detail: "Stay in sync with live departure, arrival, and delay alerts.",
  },
  {
    title: "Seats you can trust",
    detail: "Pick the seat that suits you and lock it in seconds.",
  },
  {
    title: "Flexible filters",
    detail: "Compare AC, sleeper, express, or budget routes instantly.",
  },
];

const journeySteps = [
  { title: "Search smart", detail: "Enter your route, date, and let us curate the best buses." },
  { title: "Compare instantly", detail: "Filter by duration, comfort, or price before you book." },
  { title: "Board confidently", detail: "Share your live ticket with friends and track arrivals." },
];

const testimonials = [
  {
    quote: "Planning my weekend trips is finally effortless. The search feels modern and fast.",
    name: "Riya, Chennai",
  },
  {
    quote: "As an operator I can add trips in minutes and keep passengers in the loop.",
    name: "Ganesh, Fleet Admin",
  },
];

const heroStats = [
  { value: "250+", label: "Daily departures" },
  { value: "4.9/5", label: "Traveler rating" },
  { value: "45s", label: "Average booking time" },
];

const heroPerks = ["Refund-friendly schedules", "Wallet-safe payments", "Boarding updates via SMS"];

const HomePage: React.FC = () => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${LocalHost}/user/account`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const data = res.data[0];
        setUser({
          name: data.userName,
          role: data.role,
        });
      } catch (error: any) {
        console.log("Error fetching user:", error.message);
      }
    };

    fetchUser();
  }, []);

  const isAdmin = user?.role === "admin";

  return (
    <div className="home-page">
      <NavBar />
      <main className="home-content">
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-eyebrow">Smarter bus travel for every journey</p>
            <h1 className="hero-title">
              {isAdmin ? "Run your fleet with clarity." : "Plan your next ride with confidence."}
            </h1>
            <p className="hero-description">
              {isAdmin
                ? "Create trips, monitor seats, and keep passengers updated from a single dashboard."
                : "Discover curated routes, compare comfort options, and board with live updates across the country."}
            </p>
            <div className="hero-stats">
              {heroStats.map((stat) => (
                <div key={stat.label} className="hero-stat-card">
                  <span>{stat.value}</span>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="hero-actions">
              <button
                type="button"
                className="primary-cta"
                onClick={() => navigate(isAdmin ? "/admin/addbus" : "/search")}
              >
                {isAdmin ? "Manage buses" : "Search buses"}
              </button>
              <button type="button" className="secondary-cta" onClick={() => navigate("/login")}>
                {user ? "Switch account" : "Login / Sign up"}
              </button>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-card">
              <p className="hero-card-title">Instant search</p>
              <SearchBar />
              <ul className="hero-perks">
                {heroPerks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {isAdmin && (
          <section className="admin-panel-wrapper">
            <div className="section-heading">
              <h2>Fleet overview</h2>
              <p>Review buses, update trips, and reset seats without leaving the page.</p>
            </div>
            <AdminBus />
          </section>
        )}

        {!isAdmin && (
          <>
            <section className="feature-grid">
              {featureHighlights.map((feature) => (
                <article key={feature.title} className="feature-card">
                  <h3>{feature.title}</h3>
                  <p>{feature.detail}</p>
                </article>
              ))}
            </section>

            <section className="experience-section">
              <div className="section-heading">
                <h2>Designed for effortless trips</h2>
                <p>Three simple steps to get from search to boarding pass.</p>
              </div>
              <div className="experience-timeline">
                {journeySteps.map((step, index) => (
                  <div key={step.title} className="experience-step">
                    <span>{index + 1}</span>
                    <div>
                      <h4>{step.title}</h4>
                      <p>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="testimonials-section">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.name} className="testimonial-card">
                  <blockquote>“{testimonial.quote}”</blockquote>
                  <figcaption>{testimonial.name}</figcaption>
                </figure>
              ))}
            </section>
          </>
        )}

        <section className="cta-banner">
          <div>
            <h2>Ready for your next boarding pass?</h2>
            <p>Save your preferred routes, unlock priority boarding, and share trips in one tap.</p>
          </div>
          <div className="cta-actions">
            <button type="button" className="primary-cta" onClick={() => navigate("/search")}>
              Start searching
            </button>
            <button type="button" className="secondary-cta" onClick={() => navigate("/login")}>
              Create account
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
