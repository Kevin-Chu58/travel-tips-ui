import { Typography } from "@mui/material";

const generateInputRegex = (input: string) => {
  const words = input
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")); // escape regex specials

  const pattern = words.length > 0 ? `(${words.join("|")})` : "$.^"; // matches nothing if empty
  return new RegExp(pattern, "gi"); // global + case-insensitive
};

const getHighlightedText = (text: string, matchString: string, color?: string) => {
  const inputRegex = generateInputRegex(matchString);

  const caseInsensitiveRegex = new RegExp(
    inputRegex.source,
    inputRegex.flags.includes("i") ? inputRegex.flags : inputRegex.flags + "i" // ensure /i flag
  );

  return text.split(caseInsensitiveRegex).map((part, index) =>
    part === "" ? null : (
      <Typography
        component="span"
        sx={{
          fontSize: "inherit",
          borderRadius: 1,
          px: 0.2,
          mx: -0.2,
          bgcolor: index % 2 === 1 ? (color ?? "primary.100") : "transparent",
        }}
        key={index}
      >
        {part}
      </Typography>
    )
  );
};

export const HighlighterHelper = {
  getHighlightedText,
};
