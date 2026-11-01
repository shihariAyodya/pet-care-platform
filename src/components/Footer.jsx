import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-columns">
        <div className="footer-col brand-col">
          <div className="brand-logo">
            <img src="/store/logo.png" alt="PetCare.lk Logo" className="site-logo" />
          </div>
          <p className="footer-tagline">Everything your pet needs, all in one place.</p>
          <div className="social-icons">
            <span className="pay-badge">FB</span>
            <span className="pay-badge">IG</span>
            <span className="pay-badge">YT</span>
          </div>
        </div>

        <div className="footer-col">
          <h5>SHOP</h5>
          <ul>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/browse">Dogs</Link></li>
            <li><Link to="/browse">Cats</Link></li>
            <li><Link to="/browse">Birds</Link></li>
            <li><Link to="/browse">Small Pets</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>CUSTOMER SERVICE</h5>
          <ul>
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/profile">Order Tracking</Link></li>
            <li><Link to="/shop">Returns & Refunds</Link></li>
            <li><Link to="/shop">Shipping Info</Link></li>
            <li><Link to="/vets">FAQs</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>SERVICES</h5>
          <ul>
            <li><Link to="/vets">Vet Directory</Link></li>
            <li><Link to="/grooming">Grooming</Link></li>
            <li><Link to="/training">Training</Link></li>
            <li><Link to="/sitting">Pet Sitting</Link></li>
            <li><Link to="/transport">Pet Transport</Link></li>
            <li><Link to="/shops">Pet Shops</Link></li>
            <li><Link to="/lost-found">Lost & Found</Link></li>
          </ul>
        </div>

        <div className="footer-col payments-col">
          <h5>WE ACCEPT</h5>
          <div className="payment-badges">
            <span className="pay-badge visa">VISA</span>
            <span className="pay-badge mc">MC</span>
            <span className="pay-badge amex">AMEX</span>
            <span className="pay-badge paypal">PayPal</span>
            <span className="pay-badge apple">ApplePay</span>
            <span className="pay-badge gpay">GPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
