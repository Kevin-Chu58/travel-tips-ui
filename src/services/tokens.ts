// ChatGPT wrote this

import { LS_USER_BASIC } from "@constants/localStorage";

let cachedToken: string | undefined;
let tokenExpiry: number | undefined;

let getTokenSilentlyFn: (() => Promise<string>) | null = null;
let goToLoginPortalFn: (() => Promise<void>) | null = null;
let loginFn: (() => Promise<void>) | null = null;
let logoutFn: (() => Promise<void>) | null = null;

/** Tracks whether the user is currently logged in */
let isLoggedIn = false;

/** Tracks the user's url before logging in */
let returnToUrl: string | undefined = undefined;

// ============================================================================
// Public API
// ============================================================================

export const setGetTokenSilentlyFn = (fn: () => Promise<string>) => {
  getTokenSilentlyFn = fn;
};

export const setGoToLoginPortalFn = (fn: () => Promise<void>) => {
  goToLoginPortalFn = fn;
};

export const setLoginFn = (fn: () => Promise<void>) => {
  loginFn = fn;
};

export const setLogoutFn = (fn: () => Promise<void>) => {
  logoutFn = fn;
};

/** Mark the user as logged in (call after successful login) */
export const markLoggedIn = () => {
  isLoggedIn = true;
};

/** Mark the user as logged out (call in your logout button handler) */
export const markLoggedOut = () => {
  isLoggedIn = false;
  cachedToken = undefined;
  tokenExpiry = undefined;

  localStorage.removeItem(LS_USER_BASIC);
};

export const goToLoginPortal = async () => {
  if (goToLoginPortalFn) await goToLoginPortalFn();
};

export const login = async () => {
  if (loginFn) await loginFn();
};

export const logout = async () => {
  if (logoutFn) await logoutFn();
};

export const reauth = async () => {
  if (logoutFn) await logoutFn();
  if (loginFn) await loginFn();
};

export const setReturnToUrl = (returnTo: string) => {
  returnToUrl = returnTo;
};

export const getReturnToUrl = () => {
  return returnToUrl;
};

// ============================================================================
// Token Logic
// ============================================================================

export const ensureToken = async () => {
  const now = Date.now();
  const buffer = 60 * 1000; // 1 minute before expiry

  // Need fresh token?
  if (!cachedToken || !tokenExpiry || now + buffer > tokenExpiry) {
    return await getNewToken();
  }

  return cachedToken;
};

export const getNewToken = async (): Promise<string | undefined> => {
  if (!getTokenSilentlyFn) return undefined;
  try {
    const token = await getTokenSilentlyFn();
    cachedToken = token;

    // Decode JWT expiry
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(""),
      ),
    );

    tokenExpiry = decoded.exp * 1000;
  } catch (error: any) {
    const msg = error?.error_description?.toLowerCase() ?? "";

    const isAuthError =
      error?.error === "invalid_grant" ||
      error?.error === "login_required" ||
      msg.includes("refresh token") ||
      msg.includes("session");

    if (isAuthError) {
      // If user is NOT logged in, do nothing — silent failure
      if (!isLoggedIn) {
        return undefined;
      }

      // If user IS logged in → session expired → auto logout
      if (logoutFn) logoutFn();

      // After logging out, state is already cleared in markLoggedOut() externally
      return undefined;
    }

    // Unknown error → rethrow
    throw error;
  }
  return cachedToken;
};
