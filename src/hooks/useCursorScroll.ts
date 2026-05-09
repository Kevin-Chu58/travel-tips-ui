import type React from "react";

// trigger when scroll close to the bottom
export const useCursorScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  isLoadingRef: React.RefObject<boolean>,
  cursor: string | undefined,
  onAction: () => Promise<void>,
  bottomTrigger: number = 100,
) => {
  const handleScroll = async () => {
    if (isLoadingRef.current || !cursor) return;

    isLoadingRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // detect near-bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - bottomTrigger) {
      await onAction();
    }

    isLoadingRef.current = false;
  };

  return handleScroll;
};

export const useCursorScrollOnLoadingState = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  cursor: string | undefined,
  onAction: () => Promise<void>,
  bottomTrigger: number = 100,
) => {
  const handleScroll = async () => {
    if (isLoading || !cursor) return;

    setIsLoading(true);

    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // detect near-bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - bottomTrigger) {
      await onAction();
    }

    setIsLoading(false);
  };

  return handleScroll;
};
