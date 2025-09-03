const meterToKmStr = (meters: number, dp: number = 1) => {
  const km = meters / 1000;
  const kmRounded = Number(km.toFixed(dp));

  if (kmRounded <= .5) {
    return `${meters} m`;
  }
  return `${Number.isInteger(kmRounded) ? kmRounded.toFixed(0) : kmRounded} km`;
};

const DistanceUtils = {
  meterToKmStr,
};

export default DistanceUtils;
