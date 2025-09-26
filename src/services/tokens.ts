// ChatGPT generated this
let cachedToken: string | undefined;
let tokenExpiry: number | undefined;

let getTokenSilentlyFn: (() => Promise<string>) | null = null;

export const setGetTokenSilentlyFn = (fn: () => Promise<string>) => {
  getTokenSilentlyFn = fn;
};

export const ensureToken = async (): Promise<string | undefined> => {
  if (!getTokenSilentlyFn) return undefined;

  const now = Date.now();
  const buffer = 60 * 1000; // 1 minute

  try {
    if (!cachedToken || !tokenExpiry || now + buffer > tokenExpiry) {
      const token = await getTokenSilentlyFn();
      cachedToken = token;

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
  } catch (e) {
    return undefined;
  }

  return cachedToken;
};
