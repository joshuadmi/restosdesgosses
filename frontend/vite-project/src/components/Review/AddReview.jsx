import "./Review.css";
import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function AddReview({ restaurantId, onReviewAdded }) {
  const { user } = useAuth();
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  if (!user) {
    return <p className="not-connected-message">Connectez-vous pour laisser un avis.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post(`/reviews/${restaurantId}`, { note, commentaire });
      setNote(5);
      setCommentaire("");
      setMessage("Merci, votre avis a été pris en compte !");

      if (onReviewAdded) onReviewAdded(); 
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} >
      <label>
        Note :
        <select value={note} onChange={(e) => setNote(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Commentaire :
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          required
        />
      </label>
      <br />
      {error && <p >{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Envoi en cours…" : "Laisser un avis"}
      </button>
      {message && <p >{message}</p>}
    </form>
  );
}
