import { useEffect, useState } from "react";
import { FiWifiOff } from "react-icons/fi";

/** Thin bar at the top of the screen while the device has no internet connection. */
export default function OfflineBanner() {
  const [offline, setOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[10000] bg-neutral-900 text-white font-poppins text-sm"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex items-center justify-center gap-2 px-4 py-2 text-center">
        <FiWifiOff className="shrink-0" aria-hidden />
        <span>You're offline. Reconnect to see your latest appointments and messages.</span>
      </div>
    </div>
  );
}
