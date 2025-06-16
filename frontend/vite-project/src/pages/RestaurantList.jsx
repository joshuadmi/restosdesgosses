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
    <div>
      <h1>Les restos kids-friendly</h1>
      <input
        type="text"
        placeholder="Filtrer par ville (ex : Bayonne)"
        value={villeQuery}
        onChange={(e) => setVilleQuery(e.target.value)}
        style={{ padding: "8px", margin: "10px 0", width: "250px" }}
      />
      <div>
        <label>Critères kids friendly :</label>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {allTags.map((tag) => (
            <label key={tag}>
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

      {filteredRestaurants.length === 0 ? (
        <p>Aucun restaurant trouvé.</p>
      ) : (
        <ul>
          {filteredRestaurants.map((resto) => (
            <li key={resto._id}>
              <div>
                <h2>{resto.nom}</h2>

                {resto.valideAdmin ? (
                  <span style={{ color: "green", marginLeft: 8 }}>
                    ✔️ Vérifié
                  </span>
                ) : (
                  <span style={{ color: "orange", marginLeft: 8 }}>
                    ⏳ À valider
                  </span>
                )}

                {resto.tagsKidsFriendly &&
                  resto.tagsKidsFriendly.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        margin: "8px 0",
                      }}
                    >
                      {resto.tagsKidsFriendly.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: "#ffecb3",
                            color: "#af6f09",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            fontSize: "0.95em",
                            border: "1px solid #f5c16c",
                            display: "inline-block",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                <div style={{ margin: "10px 0" }}>
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
                  <img
                    src={resto.images[0]}
                    alt={resto.nom}
                    style={{
                      width: 120,
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: 8,
                      marginRight: 12,
                    }}
                  />
                )}
              </div>

              <button
                style={{ marginLeft: 20 }}
                onClick={() => {
                  sessionStorage.setItem("scrollPosition", window.scrollY);
                  navigate(`/restaurants/${resto._id}`);
                }}
              >
                Voir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
