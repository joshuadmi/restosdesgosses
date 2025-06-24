Contexte et objectifs

Offrir une plateforme fiable permettant aux parents de trouver et recommander des restaurants adaptés aux enfants en bas âge.

Permettre de noter, commenter, filtrer les établissements selon des critères « kids friendly » (chaise haute, espace jeux, etc.)

Impliquer les restaurateurs pour qu’ils promeuvent leur établissement.

Stack technique
Frontend : React (JSX), React Router, Axios

Backend : Node.js, Express.js, MongoDB (Mongoose)

Sécurité : JWT, bcryptjs, middleware d’authentification

Divers : dotenv, cors, architecture REST API
Installation & lancement
Prérequis
Node.js (>=18.x)

MongoDB (en local ou Atlas)

Un .env à la racine du backend :

MONGO_URI=mongodb://localhost:27017/restosdegosses
JWT_SECRET=une_chaine_secrete
PORT=5000

Backend

cd backend
npm install
npm run dev

Frontend

cd frontend
npm install
npm start