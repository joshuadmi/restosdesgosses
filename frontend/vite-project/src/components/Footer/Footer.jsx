import "./Footer.css";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <Link to="/contact">Contact</Link>
        <Link to="/mentions-legales">Mentions légales</Link>
        <Link to="/politique-confidentialite">Politique de confidentialité</Link>
      </nav>
    </footer>
  );
}
