import "../Navbar/Navbar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
          <img src="src/assets/logo.png" alt="Logo Les Restos des Gosses" />

      <Link to="/">Restos des Gosses</Link>
      <Link to="/restaurants">
        Restaurants
      </Link>

      {user ? (
        <>
          <Link to="/restaurants/new">Ajouter un resto</Link>
          <button onClick={logout}>Déconnexion</button>
        </>
      ) : (
        <>
          <Link to="/login" >
            Connexion
          </Link>
          <Link to="/register">Inscription</Link>
        </>
      )}
      {user && (user.role === "admin" || user.role === "super-user") && (
        <button onClick={() => navigate("/moderation")}>
          Gérer les validations
        </button>
      )}
    </nav>
  );
}
