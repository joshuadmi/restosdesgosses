import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import RestaurantList from "./pages/RestaurantList";
import ModerationPage from "./pages/ModerationPage";
import CreateRestaurantPage from "./pages/CreateRestaurantPage";

import Navbar from "./components/Navbar/Navbar";

function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth();

  // Non connecté : redirige vers la page login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si des rôles sont précisés, on vérifie que le rôle du user en fait partie
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />; // ou une page "403"
  }

  // Sinon, on affiche l’enfant (la page protégée)
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<RestaurantList />} />

        <Route path="/restaurants/:id" element={<RestaurantPage />} />

        <Route
          path="/moderation"
          element={
            <ProtectedRoute roles={["admin", "super-user"]}>
              <ModerationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/new"
          element={
            <ProtectedRoute roles={["admin", "super-user", "user"]}>
              <CreateRestaurantPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
