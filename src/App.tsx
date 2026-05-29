import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@/features/messages/context/SocketContext";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useCallStore } from "@/features/consultations/store/useCallStore";

import LandingPage from "@/features/landing/pages/LandingPage";
import Login from "@/features/auth/pages/LoginPage";
import SignUp from "@/features/auth/pages/SignUpPage";
import ForgotPassword from "@/features/auth/pages/ForgotPasswordPage";
import ResetPassword from "@/features/auth/pages/ResetPasswordPage";
import VerifyEmail from "@/features/auth/pages/VerifyEmailPage";
import ResendVerification from "@/features/auth/pages/ResendVerificationPage";

// Patient Dashboard Imports
import DashboardLayout from "@/features/patients/components/DashboardLayout";
import { CallInitializer } from "@/features/consultations/components/CallInitializer";
import DashboardOverview from "@/features/patients/pages/DashboardOverview";
import BrowseDoctors from "@/features/patients/pages/BrowseDoctors";
import MyAppointments from "@/features/patients/pages/MyAppointments";
import HealthRecords from "@/features/patients/pages/HealthRecords";
import PatientLabs from "@/features/patients/pages/PatientLabs";
import Messages from "@/features/patients/pages/Messages";
import Subscription from "@/features/patients/pages/Subscription";
import VideoCallRoom from "@/features/patients/pages/VideoCallRoom";
import PatientProfile from "@/features/patients/pages/PatientProfile";

// Doctor Dashboard Imports
import DoctorDashboardLayout from "@/features/doctor/components/DoctorDashboardLayout";
import DoctorVerifiedRoute from "@/features/doctor/components/DoctorVerifiedRoute";
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
import DoctorLabs from "@/features/doctor/pages/DoctorLabs";
import AdminLoginPage from "@/features/admin/pages/AdminLoginPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AdminLayout from "@/features/admin/components/AdminLayout";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import AdminDoctorList from "@/features/admin/pages/AdminDoctorList";
import AdminDoctorDetail from "@/features/admin/pages/AdminDoctorDetail";
import AdminPatients from "@/features/admin/pages/AdminPatients";
import AdminPatientDetail from "@/features/admin/pages/AdminPatientDetail";
import AdminAppointments from "@/features/admin/pages/AdminAppointments";
import AdminAppointmentDetail from "@/features/admin/pages/AdminAppointmentDetail";
import AdminSpecialties from "@/features/admin/pages/AdminSpecialties";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes - keeps data fresh but reduces frequent refreshes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {
  const { isActive, activeCallId } = useCallStore();
  const { user } = useAuthStore();
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SocketProvider>
        <Toaster position="top-right" />
        
        {/* Global Video Call Overlay */}
        {isActive && activeCallId && (
          isDoctor ? <DoctorVideoCallRoom /> : isPatient ? <VideoCallRoom /> : null
        )}
        
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
              <Route path="labs" element={<PatientLabs />} />
              <Route path="messages" element={<Messages />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="settings" element={<PatientProfile />} />
            </Route>
            <Route path="/patient/call/:appointmentId" element={<CallInitializer />} />
          </Route>

          {/* Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor" element={<DoctorDashboardLayout />}>
              <Route index element={<DoctorDashboardOverview />} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="notifications" element={<DoctorNotifications />} />
              <Route element={<DoctorVerifiedRoute />}>
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="patients" element={<DoctorPatients />} />
                <Route path="patients/:patientId" element={<DoctorPatientDetail />} />
                <Route path="messages" element={<DoctorMessages />} />
                <Route path="availability" element={<DoctorAvailability />} />
                <Route path="earnings" element={<DoctorEarnings />} />
                <Route path="records" element={<DoctorPendingNotes />} />
                <Route path="labs" element={<DoctorLabs />} />
              </Route>
            </Route>
            <Route element={<DoctorVerifiedRoute />}>
              <Route path="/doctor/call/:appointmentId" element={<CallInitializer />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/admin-login" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="doctors" element={<AdminDoctorList />} />
              <Route path="doctors/:doctorId" element={<AdminDoctorDetail />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="patients/:patientId" element={<AdminPatientDetail />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="appointments/:appointmentId" element={<AdminAppointmentDetail />} />
              <Route path="specialties" element={<AdminSpecialties />} />
              <Route path="health" element={<div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm"><h1 className="text-2xl font-archivo font-bold text-neutral-900 mb-1">Platform Health</h1><p className="text-neutral-600 font-poppins text-sm">Real-time infrastructure monitoring.</p></div>} />
            </Route>
          </Route>
        </Routes>
        </SocketProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
