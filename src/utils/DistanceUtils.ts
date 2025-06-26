const meterToKm = (meters: number, dp: number = 1) => {
  const km = meters / 1000;
  const kmRounded = Number(km.toFixed(dp));
  return `${Number.isInteger(kmRounded) ? kmRounded.toFixed(0) : kmRounded} km`;
};

const DistanceUtils = {
  meterToKm,
};

export default DistanceUtils;
