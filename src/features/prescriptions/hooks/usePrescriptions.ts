import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { prescriptionApi } from "../api/prescriptionApi";
import type { IssuePrescriptionData } from "@/types";

export const usePrescriptions = () => {
    return useQuery({
        queryKey: ['prescriptions'],
        queryFn: () => prescriptionApi.getPrescriptions(),
    });
};

export const useAppointmentPrescriptions = (appointmentId: string) => {
    return useQuery({
        queryKey: ['prescriptions', appointmentId],
        queryFn: () => prescriptionApi.getAppointmentPrescriptions(appointmentId),
        enabled: !!appointmentId,
    });
};

export const useIssuePrescription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ appointmentId, ...payload }: IssuePrescriptionData & { appointmentId: string }) =>
            prescriptionApi.issuePrescription(appointmentId, payload),
        onSuccess: (prescription) => {
            queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
            queryClient.invalidateQueries({ queryKey: ['prescriptions', prescription.appointmentId] });
            toast.success('Prescription issued!');
        },
    });
};

export const useUpdatePrescription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ appointmentId, ...payload }: IssuePrescriptionData & { appointmentId: string }) =>
            prescriptionApi.updatePrescription(appointmentId, payload),
        onSuccess: (prescription) => {
            queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
            queryClient.invalidateQueries({ queryKey: ['prescriptions', prescription.appointmentId] });
            toast.success('Prescription updated!');
        },
    });
};
