/**
 * Where admins sign in. Set VITE_ADMIN_LOGIN_PATH in the environment (e.g.
 * "/staff-7k2x9q") so the address isn't guessable; defaults to "/admin-login".
 * This is only a layer of obscurity — real protection is the backend rejecting
 * non-admin tokens, rate-limiting logins and (ideally) 2FA for admin accounts.
 */
const raw = (import.meta.env.VITE_ADMIN_LOGIN_PATH as string | undefined)?.trim();

export const ADMIN_LOGIN_PATH = raw ? `/${raw.replace(/^\/+|\/+$/g, '')}` : '/admin-login';

/** True for the admin dashboard area and the admin login page. */
export const isAdminPath = (pathname: string) =>
    pathname === ADMIN_LOGIN_PATH || pathname === '/admin' || pathname.startsWith('/admin/');
