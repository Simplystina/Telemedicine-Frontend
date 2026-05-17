import { api } from "@/services/axios";
import type { LabResult, CreateLabResultData, UpdateLabResultData, BulkLabResultData } from "@/types";

export const labApi = {
    requestTest: async (data: CreateLabResultData): Promise<LabResult> => {
        const response = await api.post<LabResult>('/lab-results', data);
        return response.data;
    },

    getLabResults: async (): Promise<LabResult[]> => {
        const response = await api.get<LabResult[]>('/lab-results');
        return response.data;
    },

    getLabResult: async (id: number): Promise<LabResult> => {
        const response = await api.get<LabResult>(`/lab-results/${id}`);
        return response.data;
    },

    updateLabResult: async (id: number, data: UpdateLabResultData): Promise<LabResult> => {
        const response = await api.patch<LabResult>(`/lab-results/${id}`, data);
        return response.data;
    },

    bulkRequestTests: async (data: BulkLabResultData): Promise<LabResult[]> => {
        const response = await api.post<LabResult[]>('/lab-results/bulk', data);
        return response.data;
    },

    uploadLabResult: async (id: number, file: File): Promise<LabResult> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('status', 'completed'); // Auto-complete when uploaded by patient

        const response = await api.patch<LabResult>(`/lab-results/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};
