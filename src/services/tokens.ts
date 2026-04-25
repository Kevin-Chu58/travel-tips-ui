import { LS_USER_BASIC } from "@constants/localStorage";

// ============================================================================
// State
// ============================================================================

let cachedToken: string | undefined;
let tokenExpiry: number | undefined;
let refreshPromise: Promise<string | undefined> | null = null;

let getTokenSilentlyFn: (() => Promise<string>) | null = null;
let isAuthenticatedFn: (() => Promise<boolean>) | null = null;
let goToLoginPortalFn: (() => Promise<void>) | null = null;
let loginFn: (() => Promise<void>) | null = null;
let logoutFn: (() => Promise<void>) | null = null;

let returnToUrl: string | undefined = undefined;

// ============================================================================
// Init
// ============================================================================

export const setGetTokenSilentlyFn = (fn: () => Promise<string>) => {
  getTokenSilentlyFn = fn;
};

export const setIsAuthenticatedFn = (fn: () => Promise<boolean>) => {
  isAuthenticatedFn = fn;
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

// ============================================================================
// Token
// ============================================================================

export const ensureToken = async (): Promise<string | undefined> => {
  const now = Date.now();
  const buffer = 60 * 1000;

  if (!cachedToken || !tokenExpiry || now + buffer > tokenExpiry) {
    return await getNewToken();
  }

  return cachedToken;
};

export const getNewToken = async (): Promise<string | undefined> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = _getNewToken().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

const _getNewToken = async (): Promise<string | undefined> => {
  if (!getTokenSilentlyFn) return undefined;

  try {
    const token = await getTokenSilentlyFn();
    cachedToken = token;

    // Decode JWT expiry
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    tokenExpiry = decoded.exp * 1000;

    return cachedToken;
  } catch (error: any) {
    const msg = error?.error_description?.toLowerCase() ?? "";

    const isAuthError =
      error?.error === "invalid_grant" ||
      error?.error === "login_required" ||
      msg.includes("refresh token") ||
      msg.includes("session");

    if (isAuthError) {
      // If we have user data cached, they were previously logged in
      // → session expired → force logout to clean up
      const wasLoggedIn = !!localStorage.getItem(LS_USER_BASIC);

      if (!wasLoggedIn) return undefined; // genuine guest, silent failure

      // Authenticated but session expired — force logout
      await logout();
      return undefined;
    }

    throw error;
  }
};

// ============================================================================
// Auth actions
// ============================================================================

export const goToLoginPortal = async () => {
  if (goToLoginPortalFn) await goToLoginPortalFn();
};

export const login = async () => {
  if (loginFn) await loginFn();
};

export const logout = async () => {
  _clearSession();
  if (logoutFn) await logoutFn();
  console.log("a", logoutFn);
};

export const reauth = async () => {
  _clearSession();
  if (logoutFn) await logoutFn();
  if (loginFn) await loginFn();
};

// ============================================================================
// Session
// ============================================================================

const _clearSession = () => {
  cachedToken = undefined;
  tokenExpiry = undefined;
  localStorage.removeItem(LS_USER_BASIC);
};

export const setReturnToUrl = (url: string) => {
  returnToUrl = url;
};

export const getReturnToUrl = () => {
  return returnToUrl;
};
