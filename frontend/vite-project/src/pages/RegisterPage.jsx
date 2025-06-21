import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ nom, email, motDePasse, captcha });
      navigate("/"); // Redirige vers l’accueil une fois inscrit
    } catch (err) {
      setError(err.response?.data?.error || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
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
        <label>
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
        <label>
          Mot de passe
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>

        {error && <p>{error}</p>}
        <br />

        <ReCAPTCHA
          sitekey="6LfZvmgrAAAAABe4qzlpFRRoAUOItMSyq36T3do_"
          onChange={setCaptcha}
        />
        <button type="submit" disabled={loading || !captcha}
        style={{
            cursor: loading || !captcha ? "not-allowed" : "pointer",
            opacity: loading || !captcha ? 0.6 : 1,
          }}>
          {loading ? "Inscription…" : "S’inscrire"}
        </button>
      </form>
    </main>
  );
}
