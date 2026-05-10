import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { patientApi } from "../api/patientApi";
import type { UpdatePatientProfileData } from "@/types";

export const usePatientProfile = () => {
    return useQuery({
        queryKey: ['patient-profile'],
        queryFn: () => patientApi.getMyProfile(),
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 2;
        },
    });
};

export const useUpdatePatientProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdatePatientProfileData) => patientApi.updateMyProfile(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patient-profile'] });
            toast.success('Profile updated successfully!');
        },
    });
};
