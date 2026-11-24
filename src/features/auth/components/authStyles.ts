const base =
    'inline-flex items-center justify-center gap-2 w-full h-12 rounded-xl font-poppins text-sm font-semibold focus:outline-none transition-all duration-200';

/** Main call-to-action. Works on <button> and <Link>. */
export const authPrimaryButton = `${base} bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/35 focus-visible:ring-4 focus-visible:ring-primary-500/30 active:scale-[0.99]`;

/** Quieter alternative, e.g. "Continue with Google" or "Back to sign in". */
export const authSecondaryButton = `${base} border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-900 shadow-xs focus-visible:ring-4 focus-visible:ring-primary-500/20`;
