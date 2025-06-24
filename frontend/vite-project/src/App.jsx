import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";
import RestaurantPage from "./pages/RestaurantPage";
import ModerationPage from "./pages/ModerationPage";
import CreateRestaurantPage from "./pages/CreateRestaurantPage";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />; 
  }

  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mon-compte" element={<Profile />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
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
      <Footer />
    </>
  );
}
