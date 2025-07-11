import { GoogleMapLink } from "@constants/Maps";

const extractAddress = (address: any) => {
  let addressComponents =  [
    address.city || address.town || address.village || address.county || null,  // city
    address.state || address.province || address.region || null,                // state
    address.country || null                                                     // country
  ];

  return addressComponents.filter(Boolean).join(", ");
};

const getGoogleMapLink = (address: string) => {
  return GoogleMapLink + encodeURIComponent(address);
}

const MapUtils = {
  extractAddress,
  getGoogleMapLink,
};

export default MapUtils;