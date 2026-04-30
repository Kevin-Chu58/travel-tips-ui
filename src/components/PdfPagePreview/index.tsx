import { PDF_HEIGHT, PDF_WIDTH } from "@constants/Pdf";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import React from "react";

const PdfPagePreview: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState<number>(1);

    // ✅ moved outside component — pure function, no need to recreate every render
    const initScale = useCallback(() => {
      if (!ref.current) return;

      const parent = ref.current.parentElement;
      if (!parent) return;

      const parentWidth = parent.clientWidth;
      const style = getComputedStyle(parent);
      const parentPaddingX =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

      const a4WidthPx = ref.current.offsetWidth;
      const a4HeightPx = ref.current.offsetHeight;

      const scale = (parentWidth - parentPaddingX) / a4WidthPx;
      setScale(scale);

      parent.style.height = `${a4HeightPx * scale}px`;
    }, []);

    useLayoutEffect(() => {
      initScale();
    }, [initScale]);

    return (
      <Box>
        <Box
          ref={ref}
          sx={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: PDF_WIDTH,
            height: PDF_HEIGHT,
          }}
        >
          {children}
        </Box>
      </Box>
    );
  },
);

export default PdfPagePreview;
