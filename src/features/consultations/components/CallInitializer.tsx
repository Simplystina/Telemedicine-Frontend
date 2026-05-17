import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCallStore } from "../store/useCallStore";

export function CallInitializer() {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const { startCall } = useCallStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (appointmentId) {
            startCall(appointmentId);
            // Navigate back to the dashboard, the call will persist in the global overlay
            const isDoctor = window.location.pathname.includes('/doctor/');
            navigate(isDoctor ? "/doctor" : "/patient");
        }
    }, [appointmentId, startCall, navigate]);

    return (
        <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center font-poppins">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-sm">Initializing secure call session...</p>
        </div>
    );
}
