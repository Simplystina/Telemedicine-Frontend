import axios from "axios";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const api = axios.create({ baseURL: BASE_URL });

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().user?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Queue of requests waiting on a token refresh
let isRefreshing = false;
let waitQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

function drainQueue(error: unknown, token: string | null) {
    waitQueue.forEach(p => (error ? p.reject(error) : p.resolve(token!)));
    waitQueue = [];
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        // Only attempt refresh if we actually have a token (i.e. user was logged in)
        const hasToken = !!useAuthStore.getState().user?.token;
        if (error.response?.status !== 401 || original._retry || !hasToken) {
            return Promise.reject(error);
        }

        // If already refreshing, queue this request until refresh completes
        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                waitQueue.push({ resolve, reject });
            }).then((token) => {
                original.headers.Authorization = `Bearer ${token}`;
                return api(original);
            });
        }

        original._retry = true;
        isRefreshing = true;

        try {
            const storedRefreshToken = useAuthStore.getState().refreshToken;

            // No refresh token stored — can't refresh, surface the 401
            if (!storedRefreshToken) {
                drainQueue(error, null);
                isRefreshing = false;
                return Promise.reject(error);
            }
            // Use raw axios so this call isn't caught by this interceptor
            const { data } = await axios.post<{ accessToken: string; refreshToken?: string }>(
                `${BASE_URL}/auth/refresh`,
                { refreshToken: storedRefreshToken }
            );

            const newToken = data.accessToken;
            if (data.refreshToken) {
                useAuthStore.getState().setRefreshToken(data.refreshToken);
            }
            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
                useAuthStore.getState().setUser({ ...currentUser, token: newToken });
            }

            drainQueue(null, newToken);
            original.headers.Authorization = `Bearer ${newToken}`;
            return api(original);
        } catch (refreshError) {
            drainQueue(refreshError, null);
            return Promise.reject(error); // surface original 401, don't force logout
        } finally {
            isRefreshing = false;
        }
    }
);
