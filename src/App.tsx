import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/features/landing/pages/LandingPage";
import Login from "@/features/auth/pages/LoginPage";
import SignUp from "@/features/auth/pages/SignUpPage";
import ForgotPassword from "@/features/auth/pages/ForgotPasswordPage";
import ResetPassword from "@/features/auth/pages/ResetPasswordPage";

// Dashboard Imports
import DashboardLayout from "@/features/patients/components/DashboardLayout";
import DashboardOverview from "@/features/patients/pages/DashboardOverview";
import BrowseDoctors from "@/features/patients/pages/BrowseDoctors";
import MyAppointments from "@/features/patients/pages/MyAppointments";
import HealthRecords from "@/features/patients/pages/HealthRecords";
import Messages from "@/features/patients/pages/Messages";
import Subscription from "@/features/patients/pages/Subscription";
import VideoCallRoom from "@/features/patients/pages/VideoCallRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/signup" element={<SignUp />} />
        <Route path="auth/forgot-password" element={<ForgotPassword />} />
        <Route path="auth/reset-password" element={<ResetPassword />} />

        {/* Patient Routes */}
        <Route path="/patient" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="browse-doctors" element={<BrowseDoctors />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="records" element={<HealthRecords />} />
          <Route path="messages" element={<Messages />} />
          <Route path="subscription" element={<Subscription />} />
        </Route>

        {/* Video Call — full screen, outside dashboard layout */}
        <Route path="/patient/call/:appointmentId" element={<VideoCallRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
