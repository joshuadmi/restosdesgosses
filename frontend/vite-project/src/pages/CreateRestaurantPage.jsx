import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { fetchTagsKids } from "../services/restaurants";
import axios from "axios";

export default function CreateRestaurantPage() {
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [allTags, setAllTags] = useState([]);
  const [tagsKidsFriendly, setTagsKidsFriendly] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [horaires, setHoraires] = useState("");
  const [siteweb, setSiteweb] = useState("");
  const [telephone, setTelephone] = useState("");
  const [prixMoyen, setPrixMoyen] = useState("");

  useEffect(() => {
    fetchTagsKids().then((res) => setAllTags(res.data));
  }, []);

  const handleTagChange = (tag) => {
    setTagsKidsFriendly((t) =>
      t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]
    );
  };

  // Appel à l’API adresse à chaque frappe (optimise avec un debounce pour éviter trop d’appels !)
  const handleAdresseChange = async (e) => {
    const value = e.target.value;
    setAdresse(value);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get("https://api-adresse.data.gouv.fr/search/", {
        params: { q: value, limit: 5 },
      });
      setSuggestions(res.data.features);
    } catch (err) {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setAdresse(suggestion.properties.label);
    setVille(suggestion.properties.city || ""); // récupère la ville depuis l'API
    setPostalCode(suggestion.properties.postcode || ""); // récupère le code postal
    setSuggestions([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let uploadedUrls = [];
      if (images.length > 0) {
        uploadedUrls = await uploadImagesToCloudinary();
        setImageUrls(uploadedUrls); // si tu veux les afficher après
      }

      await api.post("/restaurants", {
        nom,
        adresse,
        ville,
        postalCode,
        description,
        tagsKidsFriendly,
        horaires,
        siteweb,
        telephone,
        prixMoyen,
        images: uploadedUrls,
      });
      navigate("/restaurants");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImages(files);

    // Crée des URLs pour aperçu local
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const uploadImagesToCloudinary = async () => {
    const urls = [];
    for (let i = 0; i < images.length; i++) {
      const formData = new FormData();
      formData.append("file", images[i]);
      formData.append("upload_preset", "restos_gosse"); // ton nom de preset
      // Uploade sur Cloudinary
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/test-niveau2/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      urls.push(data.secure_url); // ou data.url
    }
    return urls;
  };

  return (
    <main style={{ maxWidth: 500, margin: "2rem auto", padding: "1rem" }}>
      <h1>Créer un restaurant</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nom
          <br />
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Adresse
          <br />
          <input
            type="text"
            value={adresse}
            onChange={handleAdresseChange}
            placeholder="Adresse"
          />
          <input
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Ville"
            hidden
          />
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Code postal"
            hidden
          />
          {/* Affichage des suggestions d'adresses */}
          {suggestions.length > 0 && (
            <ul
              style={{
                border: "1px solid #ddd",
                background: "#fff",
                position: "absolute",
                zIndex: 99,
              }}
            >
              {suggestions.map((s) => (
                <li
                  key={s.properties.id}
                  style={{ padding: "4px", cursor: "pointer" }}
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s.properties.label}
                </li>
              ))}
            </ul>
          )}
        </label>
        <br />
        <label>
          Description
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <div>
          <label>Critères kids friendly :</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {allTags.map((tag) => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={tagsKidsFriendly.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
          <label>
            Horaires
            <br />
            <input
              type="text"
              value={horaires}
              onChange={(e) => setHoraires(e.target.value)}
              placeholder="Ex: 12h-14h / 19h-22h"
            />
          </label>
          <br />
          <label>
            Site web
            <br />
            <input
              type="url"
              value={siteweb}
              onChange={(e) => setSiteweb(e.target.value)}
              placeholder="https://www.exemple.com"
            />
          </label>
          <br />
          <label>
            Téléphone
            <br />
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="06 00 00 00 00"
            />
          </label>
          <br />
          <label>
            Prix moyen par personne (€)
            <br />
            <input
              type="number"
              value={prixMoyen}
              onChange={(e) => setPrixMoyen(e.target.value)}
              placeholder="ex : 15"
              min={0}
            />
          </label>
          <br />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple
          />
        </div>
        {imagePreviews.length > 0 && (
          <div>
            {imagePreviews.map((url, i) => (
              <img src={url} alt={`aperçu ${i}`} key={i} width={120} />
            ))}
          </div>
        )}

        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Création en cours…" : "Créer"}
        </button>
      </form>
    </main>
  );
}
