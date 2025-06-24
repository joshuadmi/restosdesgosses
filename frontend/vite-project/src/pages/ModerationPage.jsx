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
      navigate("/restaurants"); 
      return;
    }
    
    // les restos à valider pour un admin
    api
      .get("/restaurants?valideAdmin=false")
      .then((res) => setRestos(res.data));
  }, [user, navigate]);

  const validerResto = async (id) => {
    await api.patch(`/restaurants/${id}/valider`);
    setRestos((restos) => restos.filter((r) => r._id !== id));
  };
  const supprimerResto = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce restaurant ?"))
      return;
    try {
      await api.delete(`/restaurants/${id}`);
      setRestos((restos) => restos.filter((r) => r._id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <main>
      <h1>Modération des fiches restaurants</h1>
      {restos.length === 0 && <p>Aucune fiche à valider, pour l'instant...</p>}
      <ul>
        {restos.map((resto) => (
          <li key={resto._id}>
            <b>{resto.nom}</b> ({resto.ville})<br />
            {resto.adresse}
            <br />
            {resto.tagsKidsFriendly?.length > 0 && (
              <span>
                <b>Tags :</b> {resto.tagsKidsFriendly.join(", ")}
              </span>
            )}
            <br />
            <button onClick={() => validerResto(resto._id)}>
              Valider cette fiche
            </button>
            <button onClick={() => supprimerResto(resto._id)}>
              Supprimer cette fiche
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
