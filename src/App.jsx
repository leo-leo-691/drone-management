import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider, useData } from "./context/DataContext";
import { Home, Login, AdminDashboard, Reports, About } from "./pages";
import { SplashScreen } from "./components";
import "./styles/variables.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Application Content to access Hooks
function AppContent() {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if we should skip splash screen
    const path = window.location.pathname;
    return !path.startsWith("/admin") && !path.startsWith("/login");
  });

  const { dataLoaded } = useData();

  if (showSplash) {
    return (
      <SplashScreen
        dataLoaded={dataLoaded}
        finishLoading={() => setShowSplash(false)}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/report/*" element={<Reports />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
