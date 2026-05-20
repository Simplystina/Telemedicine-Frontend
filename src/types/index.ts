// Global application types and interfaces

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
}

export interface AuthUser extends User {
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignUpData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'patient' | 'doctor';
    agreeToTerms: boolean;
    hospital?: string;
    licenseNo?: string;
    yearsOfPractice?: number;
}

export interface PatientRegisterPayload {
    email: string;
    password: string;
    timezone?: string;
}

export interface DoctorRegisterPayload {
    email: string;
    password: string;
    timezone?: string;
    firstName?: string;
    lastName?: string;
    specialtyId?: number;
    hospital?: string;
    licenseNo?: string;
    yearsOfPractice?: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RegistrationResponse {
    message: string;
    userId: string;
}

export interface ResendVerificationResponse {
    message: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordData {
    token: string;
    password: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export interface FormError {
    message: string;
    field?: string;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export interface Specialty {
    id: number;
    name: string;
}

export type DoctorStatus = "verified" | "pending" | "suspended";

export interface Doctor {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    hospital?: string;
    licenseNo?: string;
    bio?: string;
    yearsOfPractice?: number;
    specialtyId?: number;
    specialty?: Specialty;
    rating?: number;
    isVerified: boolean;
    status?: DoctorStatus;
}

export interface DoctorsListResponse {
    doctors: Doctor[];
    total: number;
    page: number;
    limit: number;
}

export interface DoctorsQueryParams {
    specialty?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface UpdateDoctorProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    hospital?: string;
    licenseNo?: string;
    bio?: string;
    yearsOfPractice?: string;
    specialtyId?: number;
}

export interface AvailabilitySlot {
    dayOfWeek: number; // 0 = Sunday, 6 = Saturday
    startTime: string; // "09:00"
    endTime: string;   // "17:00"
}

export interface UpdateAvailabilityData {
    slots: AvailabilitySlot[];
}

// ─── Patient ──────────────────────────────────────────────────────────────────

export interface PatientProfile {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    dob?: string;
    gender?: string;
    bloodType?: string;
    phone?: string;
}

export interface UpdatePatientProfileData {
    firstName?: string;
    lastName?: string;
    dob?: string;
    gender?: string;
    bloodType?: string;
    phone?: string;
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'rescheduled' | 'expired';
export type ConsultationType = 'video' | 'in-person';

export interface AppointmentDoctor {
    id: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
    specialty?: Specialty;
}

export interface AppointmentPatient {
    id: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
}

export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    date: string;           // YYYY-MM-DD
    startTime: string;      // "09:00" 24h
    endTime: string;        // "09:30" 24h
    reason?: string;
    type: ConsultationType;
    status: AppointmentStatus;
    noShowBy?: 'patient' | 'doctor' | null;
    createdAt: string;
    doctor?: AppointmentDoctor;
    patient?: AppointmentPatient;
}

export interface AppointmentsListResponse {
    appointments: Appointment[];
    total: number;
    page: number;
    limit: number;
}

export interface AppointmentsQueryParams {
    status?: AppointmentStatus;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}

export interface BookAppointmentData {
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    reason?: string;
    type: ConsultationType;
}

export interface UpdateAppointmentData {
    date?: string;
    startTime?: string;
    endTime?: string;
    status?: AppointmentStatus;
}

// ─── Consultations ────────────────────────────────────────────────────────────

export type SessionStatus = 'waiting' | 'active' | 'ended';

export interface ConsultationSession {
    id: string;
    appointmentId: string;
    roomName: string;
    status: SessionStatus;
    startedAt?: string;
    endedAt?: string;
}

export interface ConsultationToken {
    token: string;
    roomName: string;
    appId: string;
}

export interface ConsultationNotes {
    id: string;
    appointmentId: string;
    diagnosis?: string;
    clinicalNote?: string;
    treatmentPlan?: string;
    followUpDate?: string;
    patientNotes?: string;
    isSharedWithPatient?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ConsultationNotesData {
    diagnosis?: string;
    clinicalNote?: string;
    treatmentPlan?: string;
    followUpDate?: string;
    patientNotes?: string;
    isSharedWithPatient?: boolean;
}

// ─── Labs ───────────────────────────────────────────────────────────────────

export const LabResultStatus = {
    REQUESTED: 'requested',
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
} as const;

export type LabResultStatus = (typeof LabResultStatus)[keyof typeof LabResultStatus];

export interface LabResult {
    id: number;
    doctorId: number;
    patientId: number;
    appointmentId?: number;
    testName: string;
    status: LabResultStatus;
    filePath?: string;
    requestedAt: string;
    resultDate?: string;
    recommendedHospital?: string;
    instructions?: string;
    dateDue?: string;
    notes?: string;
    doctor?: Doctor;
    patient?: PatientProfile;
}

export interface CreateLabResultData {
    testName: string;
    patientId: number;
    appointmentId?: number;
    recommendedHospital?: string;
    instructions?: string;
    dateDue?: string;
}

export interface UpdateLabResultData {
    status?: LabResultStatus;
    filePath?: string;
    resultDate?: string;
    notes?: string;
}

export interface BulkLabResultData {
    patientId: number;
    appointmentId: number;
    tests: Array<{
        testName: string;
        recommendedHospital?: string;
        instructions?: string;
        dateDue?: string;
    }>;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminPatient {
    id: string;
    userId: string;
    user?: {
        id: string;
        email: string;
        isActive: boolean;
        createdAt: string;
    };
    firstName?: string;
    lastName?: string;
    dob?: string;
    gender?: string;
    bloodType?: string;
    phone?: string;
}

export interface AdminPatientsListResponse {
    data: AdminPatient[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface AdminPatientsQueryParams {
    search?: string;
    page?: number;
    limit?: number;
}

export interface AdminAppointmentsListResponse {
    data: Appointment[];
    meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface AdminAppointmentsQueryParams {
    status?: AppointmentStatus;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}


export interface AdminDoctor {
    id: string;
    userId?: number;
    user?: {
        id: number;
        email: string;
        role: string;
    };
    firstName?: string;
    lastName?: string;
    hospital?: string;
    licenseNo?: string;
    bio?: string;
    yearsOfPractice?: number;
    specialtyId?: number;
    specialty?: Specialty | null;
    rating?: number;
    status: DoctorStatus;
}

export interface AdminDoctorsListResponse {
    data: AdminDoctor[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AdminDoctorsQueryParams {
    status?: DoctorStatus;
    search?: string;
    specialtyId?: number;
    page?: number;
    limit?: number;
}

export interface AdminDashboardStats {
    doctors: { total: number; verified: number; pending: number; suspended: number };
    users: { total: number };
    specialties: { total: number };
}

// ─── Prescriptions ────────────────────────────────────────────────────────────

export interface PrescriptionMedication {
    name: string;
    dosage: string;
    unit: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

export interface Prescription {
    id: string;
    appointmentId: string;
    patientId: string;
    doctorId: string;
    medications: PrescriptionMedication[];
    notes?: string;
    issuedAt: string;
}

export interface IssuePrescriptionData {
    medications: PrescriptionMedication[];
    notes?: string;
}

// ─── Messaging ────────────────────────────────────────────────────────────────

export type MessageType = 'text' | 'image' | 'file';

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    type: MessageType;
    appointmentId?: string | null;
    createdAt: string;
    isRead: boolean;
}

export interface MessageContact {
    userId: string;
    name: string;
    role: string;
    specialty?: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount: number;
}
