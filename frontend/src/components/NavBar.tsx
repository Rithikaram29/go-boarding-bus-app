import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import BusticketLogo from "../assets/BusticketLogo.png";
import { LocalHost } from "./constants";
import "./style/navbar.css";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Plan trip", path: "/search" },
    ...(user ? [{ label: "My trips", path: "/user/profile" }] : []),
    ...(user?.role === "admin" ? [{ label: "Admin", path: "/admin/addbus" }] : []),
  ];

  const ctaLabel = user?.role === "admin" ? "Manage buses" : "Book a seat";
  const ctaPath = user?.role === "admin" ? "/admin/addbus" : "/search";

  const handleAccountClick = () => setOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-left" onClick={() => handleNavigate("/")}>
          <img src={BusticketLogo} alt="Go Boarding logo" className="logo" />
          <div>
            <p className="brand-eyebrow">Go Boarding</p>
            <p className="brand-tagline">Bus travel, redesigned</p>
          </div>
        </div>

        <div className="navbar-center">
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                <button type="button" className="nav-link" onClick={() => handleNavigate(item.path)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-right">
          <button type="button" className="navbar-cta" onClick={() => handleNavigate(ctaPath)}>
            {ctaLabel}
          </button>
          <button type="button" onClick={handleAccountClick} className="account-button">
            <FontAwesomeIcon icon={faUser} />
            {user ? ` ${user.name}` : " Account"}
          </button>
        </div>
      </nav>

      {isOpen && (
        <ul className="dropdown-menu">
          {user ? (
            <>
              <li>
                <button type="button" onClick={() => handleNavigate("/")}>
                  Home
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNavigate("/user/profile")}>
                  Profile
                </button>
              </li>
              {user.role === "admin" && (
                <li>
                  <button type="button" onClick={() => handleNavigate("/admin/addbus")}>
                    Add bus
                  </button>
                </li>
              )}
              <li>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button type="button" onClick={() => handleNavigate("/login")}>
                Login
              </button>
            </li>
          )}
        </ul>
      )}
    </>
  );
};

export default NavBar;
