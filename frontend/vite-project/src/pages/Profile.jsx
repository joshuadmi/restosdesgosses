import "./Profile.css"
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    api
    .get("/users/me")
    .then((res) => {
        setUser(res.data);
        setNom(res.data.nom);
        setEmail(res.data.email);
      });
  }, [token]);


  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        "/users/me",
        { nom, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profil mis à jour !");
    } catch (err) {
      setMessage("Erreur lors de la mise à jour");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.patch(
        "/users/me/password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPwMessage("Mot de passe modifié !");
    } catch (err) {
      setPwMessage("Erreur lors du changement de mot de passe");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer définitivement votre compte ?")) return;
    try {
      await api.delete("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      alert("Erreur lors de la suppression du compte");
     

    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div>
       <h2 className="colored-title">    
          <span className="titre-blue">Mon</span>{" "}
          <span className="titre-green">com</span>{""}
          <span className="titre-red">pte</span>
          </h2>
      <form onSubmit={handleUpdate}>
        <label>
          Nom :
          <input value={nom} onChange={(e) => setNom(e.target.value)} />
        </label>
        <label>
          Email :
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button type="submit">Mettre à jour</button>
        {message && <p>{message}</p>}
      </form>

      <h2 className="colored-title">    
      <span className="titre-red">Changer</span>{" "}
          <span className="titre-blue">mot</span>{" "}
          <span className="titre-yellow">de</span>{" "}
          <span className="titre-green">passe</span>
          </h2>

      <form onSubmit={handlePasswordChange}>
        <label>
          Ancien mot de passe :
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </label>
        <label>
          Nouveau mot de passe :
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button type="submit">Modifier le mot de passe</button>
        {pwMessage && <p>{pwMessage}</p>}
      </form>

      <button className="delete-button" onClick={handleDelete} style={{ color: "red", marginTop: 20 }}>
        Supprimer mon compte
      </button>
    </div>
  );
}
