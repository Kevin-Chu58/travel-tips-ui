// gradient

const generateLinearGradientLighter = (
  baseColor: string,
  direction: string = "20deg",
  startPercent: number = 0,
  endPercent: number = 100
) => {
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

  const lightColor = lighten(baseColor, 0.4); // 40% lighter
  return `linear-gradient(${direction}, ${baseColor} ${startPercent}%, ${lightColor} ${endPercent}%)`;
};

const generateLinearGradientDarker = (
  baseColor: string,
  direction: string = "20deg",
  startPercent: number = 0,
  endPercent: number = 100
) => {
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

  const darkColor = darken(baseColor, 0.3); // 30% darker
  return `linear-gradient(${direction}, ${darkColor} ${startPercent}%, ${baseColor} ${endPercent}%)`;
};

const StyleUtils = {
  // gradient
  generateLinearGradientLighter,
  generateLinearGradientDarker,
};

export default StyleUtils;
