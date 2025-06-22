import "./HomePage.css";
import React, { useEffect, useState } from "react";
import { fetchRestaurants } from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [villeQuery, setVilleQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants()
      .then((res) => {
        setRestaurants(res.data);
        setFilteredRestaurants(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des restaurants", err);
        setLoading(false);
      });
  }, []);

  const allTags = Array.from(
    new Set(restaurants.flatMap((r) => r.tagsKidsFriendly || []))
  );

  // Filtrer les restos selon la ville tapée (insensible à la casse)
  useEffect(() => {
    let filtered = restaurants;
    // Filtrage par ville
    if (villeQuery.trim()) {
      filtered = filtered.filter((r) =>
        (r.ville || "").toLowerCase().includes(villeQuery.trim().toLowerCase())
      );
    }
    // Filtrage par tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((r) =>
        selectedTags.every((tag) => (r.tagsKidsFriendly || []).includes(tag))
      );
    }
    setFilteredRestaurants(filtered);
  }, [villeQuery, selectedTags, restaurants]);

  // Restaure la position de scroll après chargement
  // cette fonction est appelée après le chargement des données grace à useEffect et à la dépendance `loading` et `restaurants`
  useEffect(() => {
    if (!loading && restaurants.length > 0) {
      const scroll = sessionStorage.getItem("scrollPosition");
      if (scroll) {
        window.scrollTo({ top: parseInt(scroll, 10), behavior: "auto" });
        sessionStorage.removeItem("scrollPosition");
      }
    }
  }, [loading, restaurants]);

  if (loading) return <p>Chargement...</p>;

  const handleTagCheckbox = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <div className="banner">
        <h1>
          <span className="titre-yellow">Les</span>{" "}
          <span className="titre-red">Restos</span>{" "}
          <span className="titre-blue">des</span>{" "}
          <span className="titre-green">Gosses</span>
        </h1>
        <h3>On a faim d'accueil!</h3>
        <p>
          Un espace commun pour les parents à la recherche de restaurants où les
          enfants sont les bienvenus! Partagez vos bons plans, trouvez LE resto
          kids friendly et vivez de vrais moments en famille.
        </p>
        <div>
          <input
            className="search-bar"
            type="text"
            placeholder="Filtrer par ville (ex: Bayonne)"
            value={villeQuery}
            onChange={(e) => setVilleQuery(e.target.value)}
          />
          <div className="tags-list">
            {allTags.map((tag) => (
              <label className="kids-tag" key={tag}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagCheckbox(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <p>Aucun restaurant trouvé.</p>
      ) : (
        <ul className="restaurant-list">
          {filteredRestaurants.map((resto) => (
            <li className="restaurant-card " key={resto._id}>
              <div>
                <h2>{resto.nom}</h2>

                {resto.valideAdmin ? (
                  <span className="badge-verified">Vérifié par l'équipe!</span>
                ) : (
                  <span className="badge-not-verified">
                    À valider 
                  </span>
                )}

                {resto.tagsKidsFriendly &&
                  resto.tagsKidsFriendly.length > 0 && (
                    <div className="card-tags">
                      {resto.tagsKidsFriendly.map((tag) => (
                        <span className="kids-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                <div>
                  <b>Note moyenne :</b>{" "}
                  {resto.noteMoyenne
                    ? `${resto.noteMoyenne.toFixed(1)} / 5 (${
                        resto.nombreAvis
                      } avis)`
                    : "Pas encore noté"}
                </div>
                <p>
                  {resto.adresse}, {resto.ville}
                </p>
                <p>{resto.description}</p>

                {resto.images && resto.images.length > 0 && (
                  <img src={resto.images[0]} alt={resto.nom} />
                )}
              </div>

              <button
                onClick={() => {
                  sessionStorage.setItem("scrollPosition", window.scrollY);
                  navigate(`/restaurants/${resto._id}`);
                }}
              >
                Voir les détails
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default Home;
