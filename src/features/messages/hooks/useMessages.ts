import { useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../api/messagesApi';
import type { Message } from '@/types';

export function useConversationMessages(otherId: string | null) {
    return useQuery({
        queryKey: ['conversation', otherId],
        queryFn: () => messagesApi.getHistory(otherId!),
        enabled: !!otherId,
        staleTime: 10_000,
    });
}

export function useAppendMessage() {
    const qc = useQueryClient();
    return (contactUserId: string, message: Message) => {
        qc.setQueryData<Message[]>(['conversation', contactUserId], (old) => {
            if (!old) return [message];
            if (old.some((m) => m.id === message.id)) return old;
            return [...old, message];
        });
    };
}
