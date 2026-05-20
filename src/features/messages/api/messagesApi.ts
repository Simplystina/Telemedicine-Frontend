import { api } from '@/services/axios';
import type { Message } from '@/types';

export const messagesApi = {
    getHistory: async (otherId: string): Promise<Message[]> => {
        const { data } = await api.get<Message[]>('/messages', { params: { otherId } });
        return data;
    },

    markAllRead: async (): Promise<void> => {
        await api.patch('/messages/read-all');
    },
};
