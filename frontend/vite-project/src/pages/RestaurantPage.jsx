import "./RestaurantPage.css";
import { useParams } from "react-router-dom";
import AddReview from "../components/Review/AddReview";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import EditRestaurantForm from "./EditRestaurantForm";
import EditReview from "../components/Review/EditReview"; 

export default function RestaurantPage() {
  const { id } = useParams();
  const [avis, setAvis] = useState([]);
  const [resto, setResto] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const refreshAll = async () => {
    await loadRestaurant();
    await loadReviews();
  };

  const loadReviews = async () => {
    const res = await api.get(`/reviews/${id}`);
    setAvis(res.data);
  };

  const loadRestaurant = async () => {
    try {
      const res = await api.get(`/restaurants/${id}`);
      setResto(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setResto("notfound");
      } else {
        setResto(false);
      }
      console.error("Erreur lors du fetch resto :", err);
    }
  };

  // ici on charge le resto et les avis
  useEffect(() => {
    loadRestaurant();
    loadReviews();
  }, [id]);

  useEffect(() => {
    api
      .get(`/restaurants/${id}`)
      .then((res) => setResto(res.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setResto("notfound");
        } else {
          setResto(false);
        }
        console.error("Erreur lors de la récupération du resto :", err);
      });

    api
      .get(`/reviews/${id}`)
      .then((res) => setAvis(res.data))
      .catch((err) => {
        console.error("Erreur lors de la récup des avis :", err);
      });
  }, [id]);

  if (resto === false) {
    return <p>Erreur : restaurant non trouvé ou problème serveur.</p>;
  }
  if (!resto) {
    return <p>Chargement...</p>;
  }

  return (
    <main className="restaurant-page">
      <div className="button-restaurant-page">
        <button onClick={() => navigate(-1)}>Retour à la liste</button>
        {user && (
          <button onClick={() => setIsEditing(true)}>
      Modifier ce restaurant
          </button>
        )}
      </div>

      {isEditing ? (
        <EditRestaurantForm
          resto={resto}
          onCancel={() => setIsEditing(false)}
          onSave={(updated) => {
            setResto(updated);
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <h1>{resto.nom}</h1>
          {resto.valideAdmin ? (
            <span className="badge-verified">Vérifié</span>
          ) : (
            <span className="badge-not-verified">À valider</span>
          )}
          {resto.images && resto.images.length > 0 && (
            <div className="restaurant-img-card">
              {resto.images.map((img, idx) => (
                <img key={idx} src={img} alt={resto.nom} />
              ))}
            </div>
          )}

          <p>
            {resto.adresse}, {resto.ville}
          </p>
          <p>
            <b>Horaires :</b> {resto.horaires || "Non renseigné"}
            <br />
            <b>Site web :</b>{" "}
            {resto.siteweb ? (
              <a href={resto.siteweb} target="_blank" rel="noopener noreferrer">
                {resto.siteweb}
              </a>
            ) : (
              "Non renseigné"
            )}
            <br />
            <b>Téléphone :</b> {resto.telephone || "Non renseigné"}
            <br />
            <b>Prix moyen :</b>{" "}
            {resto.prixMoyen ? `${resto.prixMoyen} €` : "Non renseigné"}
          </p>

          <div className="tags-list">
            <b>Critères kids friendly:</b>{" "}
            {resto.tagsKidsFriendly && resto.tagsKidsFriendly.length > 0
              ? resto.tagsKidsFriendly.map((tag) => (
                  <span className="kids-tag" key={tag}>
                    {tag}
                  </span>
                ))
              : "Aucun"}
          </div>

          <br />

          <AddReview restaurantId={id} onReviewAdded={refreshAll} />
          <h2>Avis</h2>
          {avis.length === 0 ? (
            <p>Aucun avis pour ce restaurant.</p>
          ) : (
            <ul>
              {avis.map((r) => (
                <EditReview
                  key={r._id}
                  review={r}
                  onUpdated={refreshAll}
                  onDeleted={refreshAll}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
