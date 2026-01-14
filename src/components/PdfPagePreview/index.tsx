import { PDF_HEIGHT, PDF_WIDTH } from "@constants/Pdf";
import { useLayoutEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

const PdfPagePreview: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  function getHorizontalPadding(el: HTMLElement) {
    const style = getComputedStyle(el);
    return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }

  // render scale based on layout at init
  useLayoutEffect(() => {
    const initScale = () => {
      if (!ref.current) return;

      const parent = ref.current.parentElement;
      if (!parent) return;

      const parentWidth = parent.clientWidth;
      const parentPaddingX = getHorizontalPadding(parent);

      const a4WidthPx = ref.current.offsetWidth;
      const a4HeightPx = ref.current.offsetHeight;

      const scale = (parentWidth - parentPaddingX) / a4WidthPx;
      setScale(scale);

      parent.style.height = `${a4HeightPx * scale}px`;
    };
    initScale();
  }, []);

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
};

export default PdfPagePreview;
