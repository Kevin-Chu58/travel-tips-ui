import { Box, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import clsx from "clsx";
import "./index.scss";

type SlideProps = {
  elements: any[];
  interval?: number;
};

const Slide = ({ elements, interval = 10000 }: SlideProps) => {
  const [index, setIndex] = useState<number>(0);
  // behavior
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // init change to next element every 10 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
        next();
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // handle functions

  const prev = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.stopPropagation();
    setIndex(prev => (prev - 1 + elements.length) % elements.length);
  };

  const next = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.stopPropagation();
    setIndex(prev => (prev + 1) % elements.length);
  };

  if (elements.length === 0) return;

  return (
    <Box className="slide-container column center gap-large">
      <Box className="slide-box">
        {elements[index]}
        <Button
          className="left-nav-button"
          color="utility"
          onClick={(e) => prev(e)}
          disableRipple
        >
          <ArrowBackIosIcon />
        </Button>
        <Button
          className="right-nav-button"
          color="utility"
          onClick={(e) => next(e)}
          disableRipple
        >
          <ArrowForwardIosIcon />
        </Button>
      </Box>
      <Box className="row">
        {elements.map((_, i) => (
          <Box
            key={i}
            className={clsx("indicator", index === i && "focus")}
            onClick={() => setIndex(i)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Slide;
