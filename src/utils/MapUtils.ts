const extractAddress = (address: any) => {
  let addressComponents =  [
    address.city || address.town || address.village || address.county || null,  // city
    address.state || address.province || address.region || null,                // state
    address.country || null                                                     // country
  ];

  return addressComponents.filter(Boolean).join(", ");
};

const MapUtils = {
  extractAddress,
};

export default MapUtils;