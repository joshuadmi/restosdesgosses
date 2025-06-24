import "../Navbar/Navbar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo Les Restos des Gosses" />

        <Link to="/">Accueil</Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/restaurants/new">Ajouter restaurant</Link>
            <Link to="/mon-compte">Mon compte</Link>
            <button onClick={logout}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
        {user && (user.role === "admin" || user.role === "super-user") && (
          <button
            className="moderation"
            onClick={() => navigate("/moderation")}
          >
            Gérer les validations
          </button>
        )}
      </div>
    </nav>
  );
}
