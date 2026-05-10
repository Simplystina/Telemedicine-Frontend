import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import LandingPage from "@/features/landing/pages/LandingPage";
import Login from "@/features/auth/pages/LoginPage";
import SignUp from "@/features/auth/pages/SignUpPage";
import ForgotPassword from "@/features/auth/pages/ForgotPasswordPage";
import ResetPassword from "@/features/auth/pages/ResetPasswordPage";
import VerifyEmail from "@/features/auth/pages/VerifyEmailPage";
import ResendVerification from "@/features/auth/pages/ResendVerificationPage";

// Patient Dashboard Imports
import DashboardLayout from "@/features/patients/components/DashboardLayout";
import DashboardOverview from "@/features/patients/pages/DashboardOverview";
import BrowseDoctors from "@/features/patients/pages/BrowseDoctors";
import MyAppointments from "@/features/patients/pages/MyAppointments";
import HealthRecords from "@/features/patients/pages/HealthRecords";
import Messages from "@/features/patients/pages/Messages";
import Subscription from "@/features/patients/pages/Subscription";
import VideoCallRoom from "@/features/patients/pages/VideoCallRoom";
import PatientProfile from "@/features/patients/pages/PatientProfile";

// Doctor Dashboard Imports
import DoctorDashboardLayout from "@/features/doctor/components/DoctorDashboardLayout";
import DoctorDashboardOverview from "@/features/doctor/pages/DoctorDashboardOverview";
import DoctorAppointments from "@/features/doctor/pages/DoctorAppointments";
import DoctorPatients from "@/features/doctor/pages/DoctorPatients";
import DoctorPatientDetail from "@/features/doctor/pages/DoctorPatientDetail";
import DoctorMessages from "@/features/doctor/pages/DoctorMessages";
import DoctorAvailability from "@/features/doctor/pages/DoctorAvailability";
import DoctorEarnings from "@/features/doctor/pages/DoctorEarnings";
import DoctorProfile from "@/features/doctor/pages/DoctorProfile";
import DoctorNotifications from "@/features/doctor/pages/DoctorNotifications";
import DoctorVideoCallRoom from "@/features/doctor/pages/DoctorVideoCallRoom";
import DoctorPendingNotes from "@/features/doctor/pages/DoctorPendingNotes";
import AdminLoginPage from "@/features/admin/pages/AdminLoginPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AdminLayout from "@/features/admin/components/AdminLayout";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import AdminUserManagement from "@/features/admin/pages/AdminUserManagement";
import AdminDoctorList from "@/features/admin/pages/AdminDoctorList";
import AdminDoctorDetail from "@/features/admin/pages/AdminDoctorDetail";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="auth/login" element={<Login />} />
          <Route path="auth/signup" element={<SignUp />} />
          <Route path="auth/forgot-password" element={<ForgotPassword />} />
          <Route path="auth/reset-password" element={<ResetPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="auth/resend-verification" element={<ResendVerification />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="admin-login" element={<AdminLoginPage />} />

          {/* Patient Routes */}
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/patient" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="browse-doctors" element={<BrowseDoctors />} />
              <Route path="appointments" element={<MyAppointments />} />
              <Route path="records" element={<HealthRecords />} />
              <Route path="messages" element={<Messages />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="settings" element={<PatientProfile />} />
            </Route>
            <Route path="/patient/call/:appointmentId" element={<VideoCallRoom />} />
          </Route>

          {/* Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor" element={<DoctorDashboardLayout />}>
              <Route index element={<DoctorDashboardOverview />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="patients/:patientId" element={<DoctorPatientDetail />} />
              <Route path="messages" element={<DoctorMessages />} />
              <Route path="availability" element={<DoctorAvailability />} />
              <Route path="earnings" element={<DoctorEarnings />} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="notifications" element={<DoctorNotifications />} />
              <Route path="records" element={<DoctorPendingNotes />} />
            </Route>
            <Route path="/doctor/call/:appointmentId" element={<DoctorVideoCallRoom />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/admin-login" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="doctors" element={<AdminDoctorList />} />
              <Route path="doctors/:doctorId" element={<AdminDoctorDetail />} />
              <Route path="patients" element={<AdminUserManagement />} />
              <Route path="health" element={<div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm"><h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Platform Health</h1><p className="text-neutral-600 font-poppins text-sm">Real-time infrastructure monitoring.</p></div>} />
              <Route path="settings" element={<div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm"><h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">System Config</h1><p className="text-neutral-600 font-poppins text-sm">Tune platform parameters.</p></div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
