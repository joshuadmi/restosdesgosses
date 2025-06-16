import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link
        to="/"
        style={{
          fontWeight: "bold",
          color: "#76e460",
          fontSize: "1.3rem",
          marginRight: 20,
        }}
      >
        Restos des Gosses
      </Link>
      <Link to="/restaurants" style={{ marginRight: 16 }}>
        Restaurants
      </Link>

      {user ? (
        <>
          <Link to="/restaurants/new">Ajouter un resto</Link>
          <button onClick={logout}>Déconnexion</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 16 }}>
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
