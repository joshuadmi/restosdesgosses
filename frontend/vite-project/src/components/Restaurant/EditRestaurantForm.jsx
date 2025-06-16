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
    // Ajoute d'autres champs si besoin !
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        // Ajoute ici les autres champs à préremplir
      });
    }
  }, [resto]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        <input name="telephone" value={form.telephone} onChange={handleChange} />
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
