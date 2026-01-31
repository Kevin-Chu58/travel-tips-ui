import type React from "react";

type DefaultHighlightParams = {
  children: React.ReactNode;
};

const DefaultHighlight = ({ children }: DefaultHighlightParams) => {
  return <span style={{ backgroundColor: "var(--info-100)" }}>{children}</span>;
};

export default DefaultHighlight;
