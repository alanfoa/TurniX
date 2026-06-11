import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MisTurnos from "./pages/MisTurnos";
import Profile from "./pages/Profile";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import Professionals from "./pages/Dashboard/Professionals";
import Services from "./pages/Dashboard/Services";
import AvailabilityPage from "./pages/Dashboard/AvailabilityPage";
import AppointmentsManager from "./pages/Dashboard/AppointmentsManager";
import Clients from "./pages/Dashboard/Clients";
import { Toaster } from "./components/ui/sonner";
import { Role } from "./types/user";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/mis-turnos"
            element={
              <ProtectedRoute roles={[Role.ADMIN, Role.CLIENT]}>
                <MisTurnos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute roles={[Role.ADMIN, Role.CLIENT]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={[Role.ADMIN]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profesionales" element={<Professionals />} />
            <Route path="servicios" element={<Services />} />
            <Route path="horarios" element={<AvailabilityPage />} />
            <Route path="turnos" element={<AppointmentsManager />} />
            <Route path="clientes" element={<Clients />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
