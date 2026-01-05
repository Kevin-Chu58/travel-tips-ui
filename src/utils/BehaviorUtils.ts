const sleep = (ms?: number) =>
  new Promise((resolve) => setTimeout(resolve, ms ?? 600));

/**
 * Scrolls the element with the given ID into the visible area of the browser window.
 * @param id The ID of the target element.
 * @param smooth Optional parameter to enable smooth scrolling behavior.
 */
function scrollToElementById(id: string, smooth: boolean = true): void {
  // Use document.getElementById to find the element
  const element = document.getElementById(id);

  // Check if the element exists before trying to scroll
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? "smooth" : "auto", // Smooth animation or instant jump
      block: "start", // Aligns the top of the element to the top of the viewport
      inline: "nearest", // Aligns the element as close to the viewport edge as possible
    });
  } else {
    console.warn(`Element with ID "${id}" not found.`);
  }
}

const isVerticallyOverflowing = (element: HTMLElement | null) => {
  if (!element) return false;
  return element.scrollHeight > element.clientHeight;
};

const isScrollbarAtBottom = (element: HTMLElement | null) => {
  if (!element) return true;
  return (
    Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) <=
    1
  );
};

export const BehaviorUtils = {
  sleep,
  scrollToElementById,
  isVerticallyOverflowing,
  isScrollbarAtBottom,
};
