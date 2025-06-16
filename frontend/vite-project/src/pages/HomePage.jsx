import React, { useEffect, useState } from 'react';
import { fetchRestaurants } from '../services/api';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants()
      .then(res => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des restaurants', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Les restos kids-friendly</h1>
      {restaurants.length === 0 ? (
        <p>Aucun restaurant trouvé.</p>
      ) : (
        <ul>
          {restaurants.map(resto => (
            <li key={resto._id}>
              <h2>{resto.nom}</h2>
              <p>{resto.adresse}, {resto.ville}</p>
              <p>{resto.description}</p>
              {/* Tu peux afficher d'autres infos ici */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
