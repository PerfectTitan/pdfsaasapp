import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import ResetPassword from "./components/auth/ResetPassword";
import routes from "tempo-routes";
import { useAuth } from "./contexts/AuthContext";

// Lazy load profile pages for better performance
const ProfilePage = lazy(() => import("./components/profile/ProfilePage"));
const AccountSettings = lazy(
  () => import("./components/profile/AccountSettings"),
);
const TeamManagement = lazy(
  () => import("./components/profile/TeamManagement"),
);

function App() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Profile routes - protected by auth check */}
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/" />}
          />
          <Route
            path="/account-settings"
            element={user ? <AccountSettings /> : <Navigate to="/" />}
          />
          <Route
            path="/team-management"
            element={user ? <TeamManagement /> : <Navigate to="/" />}
          />

          {/* Add a catch-all route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
