import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import Logo from "@assets/logo.png";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

/** Shown for any address that doesn't exist (and for admin pages a visitor may not see). */
export default function NotFoundPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Send signed-in users to their own dashboard, everyone else to the landing page.
  const homePath = user?.role === "doctor" ? "/doctor" : user?.role === "patient" ? "/patient" : "/";
  const homeLabel = homePath === "/" ? "Go to home page" : "Go to my dashboard";

  // History length is 1 when the user opened this address directly (nothing to go back to).
  const canGoBack = window.history.length > 1;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 px-4 py-12 text-center">
      <Link to="/" className="flex items-center mb-10" aria-label="Likita24 home">
        <img src={Logo} alt="" className="w-12 h-12" />
        <span className="ml-3 font-archivo text-2xl font-bold text-primary-500">Likita24</span>
      </Link>

      <p className="font-archivo text-7xl sm:text-8xl font-bold text-primary-500 leading-none">404</p>
      <h1 className="mt-6 font-archivo text-2xl sm:text-3xl font-bold text-neutral-900">
        We can't find that page
      </h1>
      <p className="mt-3 max-w-md font-poppins text-neutral-600">
        The page you're looking for may have moved, or the address may be typed wrong.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link
          to={homePath}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-poppins text-sm font-medium px-5 py-3 transition-colors"
        >
          <FiHome aria-hidden /> {homeLabel}
        </Link>
        {canGoBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-200 text-neutral-900 font-poppins text-sm font-medium px-5 py-3 transition-colors"
          >
            <FiArrowLeft aria-hidden /> Go back
          </button>
        )}
      </div>
    </main>
  );
}
