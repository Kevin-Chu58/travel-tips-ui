// lighten / darken

const lighten = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + (255 - (num >> 16)) * percent);
  const g = Math.min(
    255,
    ((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * percent
  );
  const b = Math.min(
    255,
    (num & 0x0000ff) + (255 - (num & 0x0000ff)) * percent
  );

  return `#${(
    (1 << 24) +
    (Math.round(r) << 16) +
    (Math.round(g) << 8) +
    Math.round(b)
  )
    .toString(16)
    .slice(1)}`;
};

const darken = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) * (1 - percent));
  const g = Math.max(0, ((num >> 8) & 0x00ff) * (1 - percent));
  const b = Math.max(0, (num & 0x0000ff) * (1 - percent));

  return `#${(
    (1 << 24) +
    (Math.round(r) << 16) +
    (Math.round(g) << 8) +
    Math.round(b)
  )
    .toString(16)
    .slice(1)}`;
};

// gradient

const generateLinearGradientLighter = (
  baseColor: string,
  direction: string = "20deg",
  startPercent: number = 0,
  endPercent: number = 100,
  colorPercent: number = 0.2
) => {
  const lightColor = lighten(baseColor, colorPercent);
  return `linear-gradient(${direction}, ${baseColor} ${startPercent}%, ${lightColor} ${endPercent}%)`;
};

const generateLinearGradientDarker = (
  baseColor: string,
  direction: string = "20deg",
  startPercent: number = 0,
  endPercent: number = 100,
  colorPercent: number = 0.2
) => {
  const darkColor = darken(baseColor, colorPercent);
  return `linear-gradient(${direction}, ${darkColor} ${startPercent}%, ${baseColor} ${endPercent}%)`;
};

// scrollbar

function getOffsetTopRelativeToContainer(
  target: HTMLElement,
  container: HTMLElement
): number {
  let offset = 0;
  let current = target;

  while (current && current !== container && current.offsetParent) {
    offset += current.offsetTop;
    current = current.offsetParent as HTMLElement;
  }

  return offset - container.offsetTop;
};

const StyleUtils = {
  // lighten / darken
  lighten,
  darken,
  // gradient
  generateLinearGradientLighter,
  generateLinearGradientDarker,
  // scrollbar
  getOffsetTopRelativeToContainer,
};

export default StyleUtils;
