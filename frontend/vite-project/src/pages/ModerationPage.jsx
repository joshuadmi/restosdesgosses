import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ModerationPage() {
  const { user } = useAuth();
  const [restos, setRestos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "super-user")) {
      navigate("/"); // Redirection si pas autorisé
      return;
    }
    // Récupère les restos non validés
    api.get("/restaurants?valideAdmin=false").then(res => setRestos(res.data));
  }, [user, navigate]);

  const validerResto = async (id) => {
    await api.patch(`/restaurants/${id}/valider`);
    setRestos(restos => restos.filter(r => r._id !== id));
  };

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Modération des fiches restaurants</h1>
      {restos.length === 0 && <p>Aucune fiche à valider 🎉</p>}
      <ul>
        {restos.map(resto => (
          <li key={resto._id} style={{ borderBottom: "1px solid #eee", marginBottom: 18, paddingBottom: 10 }}>
            <b>{resto.nom}</b> ({resto.ville})<br />
            {resto.adresse}<br />
            {resto.tagsKidsFriendly?.length > 0 && (
              <span>
                <b>Tags :</b> {resto.tagsKidsFriendly.join(", ")}
              </span>
            )}
            <br />
            <button onClick={() => validerResto(resto._id)}>
              Valider cette fiche
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
