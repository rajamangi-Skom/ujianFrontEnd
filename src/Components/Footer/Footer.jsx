import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2 className="logo">GameStore</h2>
          <p>
            Platform terbaik untuk membeli game favorit kamu dengan harga murah
            dan update terbaru setiap hari.
          </p>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li>FAQ</li>
            <li>Help Center</li>
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="socials">
            <span>Instagram</span>
            <span>Facebook</span>
            <span>Twitter</span>
            <span>Discord</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} GameStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
