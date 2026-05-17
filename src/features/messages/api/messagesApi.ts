import { api } from '@/services/axios';
import type { Message } from '@/types';

export const messagesApi = {
    send: async (receiverId: string, content: string, type = 'text'): Promise<Message> => {
        const { data } = await api.post<Message>('/messages', {
            receiverId: Number(receiverId),
            content,
            type,
        });
        return data;
    },

    getHistory: async (otherId: string): Promise<Message[]> => {
        const { data } = await api.get<Message[]>('/messages', { params: { otherId } });
        return data;
    },

    markAllRead: async (): Promise<void> => {
        await api.patch('/messages/read-all');
    },
};
