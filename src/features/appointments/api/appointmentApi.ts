import { api } from "@/services/axios";
import type {
    Appointment,
    AppointmentsListResponse,
    AppointmentsQueryParams,
    BookAppointmentData,
    UpdateAppointmentData,
} from "@/types";

export const appointmentApi = {
    bookAppointment: async (payload: BookAppointmentData): Promise<Appointment> => {
        const { data } = await api.post<Appointment>('/appointments', {
            ...payload,
            doctorId: Number(payload.doctorId),
        });
        return data;
    },

    getAppointments: async (params?: AppointmentsQueryParams): Promise<AppointmentsListResponse> => {
        const { data } = await api.get<AppointmentsListResponse>('/appointments', { params });
        return data;
    },

    getAppointmentById: async (id: string): Promise<Appointment> => {
        const { data } = await api.get<Appointment>(`/appointments/${id}`);
        return data;
    },

    updateAppointment: async (id: string, payload: UpdateAppointmentData): Promise<Appointment> => {
        const { data } = await api.patch<Appointment>(`/appointments/${id}`, payload);
        return data;
    },

    confirmAppointment: async (id: string): Promise<Appointment> => {
        const { data } = await api.post<Appointment>(`/appointments/${id}/confirm`);
        return data;
    },

    cancelAppointment: async (id: string): Promise<Appointment> => {
        const { data } = await api.post<Appointment>(`/appointments/${id}/cancel`);
        return data;
    },
};
