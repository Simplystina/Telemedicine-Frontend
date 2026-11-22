import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IoClose, IoShareOutline } from "react-icons/io5";
import { FiPlusSquare } from "react-icons/fi";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "likita24-install-dismissed-at";
const DISMISS_DAYS = 7;

function isMobileDevice() {
  const ua = navigator.userAgent;
  const isPhoneOrTablet = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  // iPadOS reports itself as a Mac; tell it apart by touch support.
  const isIPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  return isPhoneOrTablet || isIPadOS;
}

function isIOS() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

function isInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function recentlyDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/**
 * Shows an "Install Likita24" banner on phones and tablets only.
 * Android/Chrome: uses the native install prompt.
 * iOS/Safari: explains Share → Add to Home Screen (iOS has no install API).
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      // Always stop the browser's own mini-banner; we decide when to show ours.
      e.preventDefault();
      if (!isMobileDevice() || isInstalled() || recentlyDismissed()) return;
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // iOS never fires beforeinstallprompt, so show instructions directly.
    let timer: number | undefined;
    if (isIOS() && !isInstalled() && !recentlyDismissed()) {
      timer = window.setTimeout(() => {
        setShowIOSHelp(true);
        setVisible(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* storage unavailable — banner will just reappear next visit */
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === "accepted") setVisible(false);
    else dismiss();
  };

  // The installable app is for patients and doctors; never offer it on admin pages.
  const isAdminPage = /^\/admin(\/|-login|$)/.test(pathname);
  if (!visible || isAdminPage) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[9999] p-3 animate-fade-in-up"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      role="dialog"
      aria-label="Install Likita24"
    >
      <div className="mx-auto max-w-md rounded-2xl bg-white shadow-xl border border-neutral-200 p-4 flex gap-3 items-start">
        <img src="/pwa-192x192.png" alt="" className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-archivo font-bold text-neutral-900">Install Likita24</p>
          {showIOSHelp ? (
            <p className="font-poppins text-sm text-neutral-600 mt-1 leading-relaxed">
              Tap <IoShareOutline className="inline -mt-1 text-primary-600" aria-label="Share" /> then{" "}
              <span className="font-medium text-neutral-900">
                Add to Home Screen <FiPlusSquare className="inline -mt-0.5" />
              </span>{" "}
              to get the app.
            </p>
          ) : (
            <>
              <p className="font-poppins text-sm text-neutral-600 mt-1">
                Add Likita24 to your home screen for quick access to your doctor.
              </p>
              <button
                onClick={install}
                className="mt-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-poppins text-sm font-medium px-4 py-2"
              >
                Install app
              </button>
            </>
          )}
        </div>
        <button onClick={dismiss} aria-label="Dismiss" className="text-neutral-500 hover:text-neutral-900 p-1 -m-1">
          <IoClose size={20} />
        </button>
      </div>
    </div>
  );
}
