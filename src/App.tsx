import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@/features/messages/context/SocketContext";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useCallStore } from "@/features/consultations/store/useCallStore";

import LandingPage from "@/features/landing/pages/LandingPage";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

// Auth pages
const Login               = lazy(() => import("@/features/auth/pages/LoginPage"));
const SignUp              = lazy(() => import("@/features/auth/pages/SignUpPage"));
const ForgotPassword      = lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));
const ResetPassword       = lazy(() => import("@/features/auth/pages/ResetPasswordPage"));
const VerifyEmail         = lazy(() => import("@/features/auth/pages/VerifyEmailPage"));
const ResendVerification  = lazy(() => import("@/features/auth/pages/ResendVerificationPage"));
const AdminLoginPage      = lazy(() => import("@/features/admin/pages/AdminLoginPage"));

// Patient pages
const DashboardLayout  = lazy(() => import("@/features/patients/components/DashboardLayout"));
const DashboardOverview = lazy(() => import("@/features/patients/pages/DashboardOverview"));
const BrowseDoctors    = lazy(() => import("@/features/patients/pages/BrowseDoctors"));
const MyAppointments   = lazy(() => import("@/features/patients/pages/MyAppointments"));
const HealthRecords    = lazy(() => import("@/features/patients/pages/HealthRecords"));
const PatientLabs      = lazy(() => import("@/features/patients/pages/PatientLabs"));
const Messages         = lazy(() => import("@/features/patients/pages/Messages"));
const Subscription     = lazy(() => import("@/features/patients/pages/Subscription"));
const VideoCallRoom    = lazy(() => import("@/features/patients/pages/VideoCallRoom"));
const PatientProfile   = lazy(() => import("@/features/patients/pages/PatientProfile"));
const CallInitializer  = lazy(() =>
  import("@/features/consultations/components/CallInitializer")
    .then(m => ({ default: m.CallInitializer }))
);

// Doctor pages
const DoctorDashboardLayout  = lazy(() => import("@/features/doctor/components/DoctorDashboardLayout"));
const DoctorVerifiedRoute    = lazy(() => import("@/features/doctor/components/DoctorVerifiedRoute"));
const DoctorDashboardOverview = lazy(() => import("@/features/doctor/pages/DoctorDashboardOverview"));
const DoctorAppointments     = lazy(() => import("@/features/doctor/pages/DoctorAppointments"));
const DoctorPatients         = lazy(() => import("@/features/doctor/pages/DoctorPatients"));
const DoctorPatientDetail    = lazy(() => import("@/features/doctor/pages/DoctorPatientDetail"));
const DoctorMessages         = lazy(() => import("@/features/doctor/pages/DoctorMessages"));
const DoctorAvailability     = lazy(() => import("@/features/doctor/pages/DoctorAvailability"));
const DoctorEarnings         = lazy(() => import("@/features/doctor/pages/DoctorEarnings"));
const DoctorProfile          = lazy(() => import("@/features/doctor/pages/DoctorProfile"));
const DoctorNotifications    = lazy(() => import("@/features/doctor/pages/DoctorNotifications"));
const DoctorVideoCallRoom    = lazy(() => import("@/features/doctor/pages/DoctorVideoCallRoom"));
const DoctorPendingNotes     = lazy(() => import("@/features/doctor/pages/DoctorPendingNotes"));
const DoctorLabs             = lazy(() => import("@/features/doctor/pages/DoctorLabs"));

// Admin pages
const AdminLayout           = lazy(() => import("@/features/admin/components/AdminLayout"));
const AdminDashboard        = lazy(() => import("@/features/admin/pages/AdminDashboard"));
const AdminDoctorList       = lazy(() => import("@/features/admin/pages/AdminDoctorList"));
const AdminDoctorDetail     = lazy(() => import("@/features/admin/pages/AdminDoctorDetail"));
const AdminPatients         = lazy(() => import("@/features/admin/pages/AdminPatients"));
const AdminPatientDetail    = lazy(() => import("@/features/admin/pages/AdminPatientDetail"));
const AdminAppointments     = lazy(() => import("@/features/admin/pages/AdminAppointments"));
const AdminAppointmentDetail = lazy(() => import("@/features/admin/pages/AdminAppointmentDetail"));
const AdminSpecialties      = lazy(() => import("@/features/admin/pages/AdminSpecialties"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
});

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
            <Suspense fallback={null}>
              {isDoctor ? <DoctorVideoCallRoom /> : isPatient ? <VideoCallRoom /> : null}
            </Suspense>
          )}

          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </SocketProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
