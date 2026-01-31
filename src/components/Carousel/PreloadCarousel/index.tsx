import React, { useState, useEffect, useRef, type ReactNode } from "react";
import { Box } from "@mui/material";
import type { Image } from "@services/images";
import TTIconButton from "@components/TTIconButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useIsMobile } from "@hooks/useIsMobile";
import clsx from "clsx";
import "./index.scss";

type PreloadCarouselProps = {
  images: Image[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  readonly?: boolean;
  onClick?: () => void;
  onDelete?: (state: number) => void;
  interval?: number;
  height?: number;
  innerButtons?: boolean;
  circularBorder?: boolean;
  children?: ReactNode;
};

const PreloadCarousel = ({
  images,
  index,
  setIndex,
  readonly = false,
  onClick,
  onDelete = () => {},
  interval = 4000,
  height = 200,
  innerButtons = false,
  circularBorder = false,
  children,
}: PreloadCarouselProps) => {
  // window
  const isMobile = useIsMobile();
  // settings
  const slideWidthPercent = 58;
  const [translate, setTranslate] = useState<number>(-slideWidthPercent);
  const [animating, setAnimating] = useState<boolean>(false);
  const slideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  if (!images || images.length === 0) return null;

  const prevIndex = (index - 1 + images.length) % images.length;
  const nextIndex = (index + 1) % images.length;

  const scrollToLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const scrollToRight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.stopPropagation();
    onDelete(index);
  };

  useEffect(() => {
    setIndex(0);
  }, [images.length]);

  // set scrolling interval
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (images.length > 1) {
        setAnimating(true);
        setTranslate(-2 * slideWidthPercent);
        slideTimeoutRef.current = setTimeout(() => {
          setAnimating(false);
          setIndex((prev) => (prev + 1) % images.length);
          setTranslate(-slideWidthPercent);
        }, 500);
      }
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
    };
  }, [interval, images.length]);

  const imageSrc = [
    {
      src: images[prevIndex].url,
      alt: "prev",
    },
    {
      src: images[index]?.url,
      alt: "current",
    },
    {
      src: images[nextIndex].url,
      alt: "next",
    },
  ];

  return (
    <Box
      className="preload-carousel-box"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: `${height}px`,
      }}
    >
      {/* image-layer */}
      <Box
        className={clsx(
          "preload-carousel-image-overflow-container",
          circularBorder && "circular-border",
        )}
      >
        <Box
          className={clsx("preload-carousel-image-box", animating && "animate")}
          sx={{
            width: `${3 * slideWidthPercent}%`,
            transform: `translateX(${translate}%)`,
          }}
        >
          {imageSrc.map((image) => (
            <img
              key={image.alt}
              className="preload-carousel-image"
              src={image.src}
              alt={image.alt}
              style={{
                width: `${slideWidthPercent}%`,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* action layer */}
      {(isHovered || isMobile) && (
        <React.Fragment>
          {/* scroll buttons */}
          <Box
            className={clsx(
              "preload-carousel-scroll-left-button-box",
              innerButtons && "inner",
            )}
          >
            <TTIconButton
              className="preload-carousel-scroll-button"
              onClick={(e) => scrollToLeft(e)}
              sx={{}}
            >
              <KeyboardArrowLeftIcon />
            </TTIconButton>
          </Box>
          <Box
            className={clsx(
              "preload-carousel-scroll-right-button-box",
              innerButtons && "inner",
            )}
          >
            <TTIconButton
              onClick={(e) => scrollToRight(e)}
              className="preload-carousel-scroll-button"
            >
              <KeyboardArrowRightIcon />
            </TTIconButton>
          </Box>
          {/* delete button */}
          {!readonly ? (
            <Box className="preload-carousel-delete-button-box">
              <TTIconButton
                onClick={(e) => handleDelete(e, index)}
                className="preload-carousel-scroll-button"
              >
                <DeleteOutlineIcon />
              </TTIconButton>
            </Box>
          ) : undefined}
        </React.Fragment>
      )}

      {children}
    </Box>
  );
};

export default PreloadCarousel;
