import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { doctorApi } from "../api/doctorApi";
import type { DoctorsQueryParams, UpdateDoctorProfileData, UpdateAvailabilityData } from "@/types";

// ── Public hooks ──────────────────────────────────────────────────────────────

export const useSpecialties = () => {
    return useQuery({
        queryKey: ['specialties'],
        queryFn: () => doctorApi.getSpecialties(),
        staleTime: Infinity,
    });
};

export const useDoctors = (params?: DoctorsQueryParams) => {
    return useQuery({
        queryKey: ['doctors', params],
        queryFn: () => doctorApi.getDoctors(params),
    });
};

export const useDoctor = (id: string) => {
    return useQuery({
        queryKey: ['doctor', id],
        queryFn: () => doctorApi.getDoctorById(id),
        enabled: !!id,
    });
};

export const useDoctorAvailability = (id: string) => {
    return useQuery({
        queryKey: ['doctor-availability', id],
        queryFn: () => doctorApi.getDoctorAvailability(id),
        enabled: !!id,
    });
};

// ── Doctor-only hooks ─────────────────────────────────────────────────────────

export const useMyDoctorProfile = () => {
    return useQuery({
        queryKey: ['my-doctor-profile'],
        queryFn: () => doctorApi.getMyProfile(),
    });
};

export const useUpdateDoctorProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateDoctorProfileData) => doctorApi.updateMyProfile(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-doctor-profile'] });
            toast.success('Profile updated successfully!');
        },
    });
};

export const useMyAvailability = () => {
    return useQuery({
        queryKey: ['my-availability'],
        queryFn: () => doctorApi.getMyAvailability(),
    });
};

export const useUpdateAvailability = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateAvailabilityData) => doctorApi.saveMyAvailability(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-availability'] });
            toast.success('Availability saved!');
        },
    });
};
