import { useRealtimeStore } from '../store/realtime.store';

export const useConnectionState = () => useRealtimeStore((s) => s.connectionState);
