import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { appointmentApi } from "../api/appointmentApi";
import type {
    AppointmentsQueryParams,
    BookAppointmentData,
    UpdateAppointmentData,
} from "@/types";

export const useAppointments = (params?: AppointmentsQueryParams) => {
    return useQuery({
        queryKey: ['appointments', params],
        queryFn: () => appointmentApi.getAppointments(params),
    });
};

export const useAppointment = (id: string) => {
    return useQuery({
        queryKey: ['appointment', id],
        queryFn: () => appointmentApi.getAppointmentById(id),
        enabled: !!id,
    });
};

export const useBookAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: BookAppointmentData) => appointmentApi.bookAppointment(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success('Appointment booked!');
        },
    });
};

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...payload }: UpdateAppointmentData & { id: string }) =>
            appointmentApi.updateAppointment(id, payload),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['appointment', updated.id] });
        },
    });
};

export const useConfirmAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => appointmentApi.confirmAppointment(id),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['appointment', updated.id] });
            toast.success('Appointment confirmed!');
        },
    });
};

export const useCancelAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => appointmentApi.cancelAppointment(id),
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['appointment', updated.id] });
            toast.success('Appointment cancelled.');
        },
    });
};
