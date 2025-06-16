import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ nom, email, motDePasse });
      navigate("/"); // Redirige vers l’accueil une fois inscrit
    } catch (err) {
      setError(err.response?.data?.error || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nom
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            autoComplete="name"
          />
        </label>
        <br />
        <label style={{ marginTop: "1rem" }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <br />
        <label style={{ marginTop: "1rem" }}>
          Mot de passe
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        <br />

        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Inscription…" : "S’inscrire"}
        </button>
      </form>
    </main>
  );
}
