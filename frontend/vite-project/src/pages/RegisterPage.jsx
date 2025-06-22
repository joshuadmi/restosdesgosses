
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const captchaRef = useRef(null);

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError("Merci d’accepter la politique de confidentialité.");
      setLoading(false);
      return;
    }
    if (!captcha) {
      setError("Captcha manquant");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      await register({ nom, email, motDePasse, captcha });
      navigate("/"); // Redirige vers l’accueil une fois inscrit
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.map((e) => e.msg).join(" / "));
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Erreur inconnue");
      }
      if (captchaRef.current) {
        captchaRef.current.reset();
        setCaptcha(""); // Vide aussi le token du state, pour forcer une nouvelle validation
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1 className="colored-title">    
          <span className="titre-yellow"></span>{""}
          <span className="titre-red">Ins</span>{""}
          <span className="titre-yellow">crip</span>{""}
          <span className="titre-green">tion</span>
          </h1>
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

        {error && <p className="error">{error}</p>}
        <br />

        <ReCAPTCHA
          ref={captchaRef}
          sitekey="6LfZvmgrAAAAABe4qzlpFRRoAUOItMSyq36T3do_"
          onChange={setCaptcha}
        />

        <label style={{ display: "block", marginTop: "1rem" }}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />{" "}
          J’accepte la{" "}
          <a
            href="/politique-confidentialite"
            target="_blank"
            rel="noopener noreferrer"
          >
            politique de confidentialité
          </a>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Inscription…" : "S’inscrire"}
        </button>
      </form>
    </main>
  );
}
