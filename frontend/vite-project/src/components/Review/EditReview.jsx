import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext"; // adapte ce chemin si besoin

export default function EditReview({ review, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(review.note);
  const [commentaire, setCommentaire] = useState(review.commentaire);
  const { user } = useAuth();

  // Mise à jour de l'avis
  const handleEdit = async (e) => {
    e.preventDefault();
    await api.put(`/reviews/edit/${review._id}`, { note, commentaire });
    setEditing(false);
    if (onUpdated) onUpdated();
  };

  // Suppression de l'avis
  const handleDelete = async () => {
    if (window.confirm("Supprimer cet avis ?")) {
      await api.delete(`/reviews/delete/${review._id}`);
      if (onDeleted) onDeleted();
    }
  };

  
  // Affichage normal ou mode édition
  

  if (!editing) {
    return (
      <li >
        <b>{review.auteur?.nom || "Utilisateur"}</b> : <b>{review.note}/5</b>
        <br />
        {review.commentaire}

        {user && (review.auteur._id === user.id || review.auteur._id === user._id || review.auteur === user.id) && (
          <>
            <br />
            <button onClick={() => setEditing(true)}>Modifier</button>
            <button onClick={handleDelete}>Supprimer</button>
          </>
        )}
      </li>
    );
  }

  console.log("User et Review:", user, review);

  // Affichage du formulaire d'édition
  return (
    <li >
      <form onSubmit={handleEdit}>
        <label>
          Note :{" "}
          <input
            type="number"
            min={1}
            max={5}
            value={note}
            onChange={e => setNote(Number(e.target.value))}
            required
            
          />
        </label>
        <br />
        <label>
          Commentaire :<br />
          <textarea
            value={commentaire}
            onChange={e => setCommentaire(e.target.value)}
            rows={3}
            cols={30}
            required
          />
        </label>
        <br />
        <button type="submit">Enregistrer</button>
        <button type="button" onClick={() => setEditing(false)}>Annuler</button>
      </form>
    </li>
  );
}
