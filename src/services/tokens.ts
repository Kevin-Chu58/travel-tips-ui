// ChatGPT wrote this

let cachedToken: string | undefined;
let tokenExpiry: number | undefined;

let getTokenSilentlyFn: (() => Promise<string>) | null = null;
let logoutFn: (() => void) | null = null;

/** Tracks whether the user is currently logged in */
let isLoggedIn = false;

// ============================================================================
// Public API
// ============================================================================

export const setGetTokenSilentlyFn = (fn: () => Promise<string>) => {
  getTokenSilentlyFn = fn;
};

export const setLogoutFn = (fn: () => void) => {
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
};

// ============================================================================
// Token Logic
// ============================================================================

export const ensureToken = async (): Promise<string | undefined> => {
  if (!getTokenSilentlyFn) return undefined;

  const now = Date.now();
  const buffer = 60 * 1000; // 1 minute before expiry

  try {
    // Need fresh token?
    if (!cachedToken || !tokenExpiry || now + buffer > tokenExpiry) {
      const token = await getTokenSilentlyFn();
      cachedToken = token;

      // Decode JWT expiry
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(
        decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("")
        )
      );

      tokenExpiry = decoded.exp * 1000;
    }
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
