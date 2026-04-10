import React from "react";
import { Typography, Box } from "@mui/material";
import type { CustomStylingTextProps } from "@constants/Types";

const ShakyText: React.FC<CustomStylingTextProps> = ({
  text,
  variant = "h4",
}) => {
  return (
    <Typography variant={variant} component="div">
      {text.split("").map((char, index) => (
        <Box
          key={index}
          component="span"
          className="sts-shaky-char"
          sx={{
            // Use CSS Variables to pass the index to the stylesheet
            "--char-index": index,
            // Ensure spaces keep their width
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </Box>
      ))}
    </Typography>
  );
};

export default ShakyText;
