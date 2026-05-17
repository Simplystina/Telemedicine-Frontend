import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { labApi } from "../api/labApi";
import type { CreateLabResultData, UpdateLabResultData } from "@/types";
import { toast } from "react-hot-toast";

export const useLabResults = () => {
    return useQuery({
        queryKey: ['lab-results'],
        queryFn: () => labApi.getLabResults(),
    });
};

export const useAppointmentLabResults = (appointmentId: string | number) => {
    return useQuery({
        queryKey: ['lab-results', 'appointment', appointmentId],
        queryFn: async () => {
            const all = await labApi.getLabResults();
            return all.filter(l => String(l.appointmentId) === String(appointmentId));
        },
        enabled: !!appointmentId,
    });
};

export const useRequestLabTest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateLabResultData) => labApi.requestTest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lab-results'] });
            toast.success('Lab test requested successfully!');
        },
    });
};

export const useBulkRequestLabTests = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => labApi.bulkRequestTests(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lab-results'] });
            toast.success('Lab tests requested successfully!');
        },
    });
};

export const useUpdateLabResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateLabResultData }) => 
            labApi.updateLabResult(id, data),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['lab-results'] });
            queryClient.invalidateQueries({ queryKey: ['lab-results', result.id] });
            toast.success('Lab result updated!');
        },
    });
};

export const useUploadLabResult = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, file }: { id: number; file: File }) => 
            labApi.uploadLabResult(id, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lab-results'] });
            toast.success('Lab result uploaded successfully!');
        },
        onError: () => {
            toast.error('Failed to upload lab result.');
        }
    });
};
