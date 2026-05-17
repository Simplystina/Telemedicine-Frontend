import { create } from 'zustand';

interface CallState {
    activeCallId: string | null;
    isMinimized: boolean;
    isActive: boolean;
    startCall: (id: string) => void;
    endCall: () => void;
    minimize: () => void;
    maximize: () => void;
}

export const useCallStore = create<CallState>((set) => ({
    activeCallId: null,
    isMinimized: false,
    isActive: false,
    startCall: (id: string) => set({ activeCallId: id, isActive: true, isMinimized: false }),
    endCall: () => set({ activeCallId: null, isActive: false, isMinimized: false }),
    minimize: () => set({ isMinimized: true }),
    maximize: () => set({ isMinimized: false }),
}));
