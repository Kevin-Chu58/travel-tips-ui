/**
 * Recursively searches for 'content' keys and ensures
 * they are wrapped in extra quotes if they aren't already.
 */
const sanitizeStyles = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) return obj;

  const newObj = { ...obj };

  for (const key in newObj) {
    if (key === "content" && typeof newObj[key] === "string") {
      const val = newObj[key].trim();
      // If it's empty or doesn't start/end with quotes, wrap it
      if (val === "" || (!val.startsWith("'") && !val.startsWith('"'))) {
        newObj[key] = `""`;
      }
    } else if (typeof newObj[key] === "object") {
      newObj[key] = sanitizeStyles(newObj[key]);
    }
  }
  return newObj;
};

export const StyleUtils = {
  sanitizeStyles,
};
