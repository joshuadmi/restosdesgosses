import { useState, useEffect } from "react";
import api from "../../services/api";

export default function EditRestaurantForm({ resto, onCancel, onSave }) {
  const [form, setForm] = useState({
    nom: "",
    adresse: "",
    description: "",
    horaires: "",
    siteweb: "",
    telephone: "",
    prixMoyen: "",
    tagsKidsFriendly: [],
    images: [], 

    // Ajoute d'autres champs si besoin !
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/test-niveau2/image/upload";
  const UPLOAD_PRESET = "restos_gosse";


  // Fonction pour uploader une image sur Cloudinary
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), data.secure_url],
        }));
      } else {
        setUploadError(
          "Erreur Cloudinary : " + (data.error?.message || "Upload échoué")
        );
      }
    } catch (err) {
      setUploadError("Erreur lors de l'upload : " + err.message);
    }
    setUploading(false);
  };

  const handleRemoveImage = (imgUrl) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((img) => img !== imgUrl),
    }));
  };

  // Pré-remplir le formulaire avec les données actuelles
  useEffect(() => {
    if (resto) {
      setForm({
        nom: resto.nom || "",
        adresse: resto.adresse || "",
        description: resto.description || "",
        horaires: resto.horaires || "",
        siteweb: resto.siteweb || "",
        telephone: resto.telephone || "",
        prixMoyen: resto.prixMoyen || "",
        tagsKidsFriendly: resto.tagsKidsFriendly || [],
        images: resto.images ? [...resto.images] : [],
        // Ajoute ici les autres champs à préremplir
      });
      api
        .get("/restaurants/tags")
        .then((res) => setAllTags(res.data))
        .catch(() => setAllTags([]));
    }
  }, [resto]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Ajoute/enlève un tag dans le tableau tagsKidsFriendly
  const handleTagChange = (tag) => {
    setForm((prev) => ({
      ...prev,
      tagsKidsFriendly: prev.tagsKidsFriendly.includes(tag)
        ? prev.tagsKidsFriendly.filter((t) => t !== tag)
        : [...prev.tagsKidsFriendly, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.put(`/restaurants/${resto._id}`, form);
      if (onSave) onSave(data);
    } catch (err) {
      setError("Erreur lors de la sauvegarde.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "1.5em 0" }}>
      <div>
        <label>Nom :</label>
        <input name="nom" value={form.nom} onChange={handleChange} />
      </div>
      <div>
        <label>Adresse :</label>
        <input name="adresse" value={form.adresse} onChange={handleChange} />
      </div>
      <div>
        <label>Description :</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      <div>
        <label>Horaires :</label>
        <input name="horaires" value={form.horaires} onChange={handleChange} />
      </div>
      <div>
        <label>Site web :</label>
        <input name="siteweb" value={form.siteweb} onChange={handleChange} />
      </div>
      <div>
        <label>Téléphone :</label>
        <input
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Prix moyen :</label>
        <input
          name="prixMoyen"
          value={form.prixMoyen}
          onChange={handleChange}
          type="number"
        />
      </div>

      {/* Ajoute ici la sélection dynamique des tags */}
      <div>
        <label>Tags kids friendly :</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {allTags.map((tag) => (
            <label key={tag} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                checked={form.tagsKidsFriendly.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>Images :</label>
        <div>
          {(form.images || []).map((img, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
            >
              <img src={img} alt="" width={80} style={{ marginRight: 8 }} />
              <button type="button" onClick={() => handleRemoveImage(img)}>
                Supprimer
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleUploadImage}
          disabled={uploading}
          style={{ marginTop: 8 }}
        />
        {uploading && (
          <span style={{ marginLeft: 8 }}>⏳ Upload en cours...</span>
        )}
        {uploadError && <div style={{ color: "red" }}>{uploadError}</div>}
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button type="submit" disabled={loading}>
        💾 Sauvegarder
      </button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "1em" }}>
        Annuler
      </button>
    </form>
  );
}
