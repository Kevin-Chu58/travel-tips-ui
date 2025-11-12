import L from "leaflet";

export type Direction = "N" | "E" | "S" | "W";

export const GoogleMapLink = "https://www.google.com/maps/search/?api=1&query=";

export const MapPin = (color: string = "var(--grey-700)") =>
  new L.DivIcon({
    html: `
    <svg width="36" height="36" viewBox="0 -10 40 40" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(12, 12) scale(1.4) translate(-12, -12)">
        <defs>
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow 
              dx="1"
              dy="1"
              stdDeviation="2"
              flood-color="rgba(0,0,0,.5)"
            />
          </filter>
        </defs>
        <path d="
          M 12 0 C 7.031 0 4 4 4 8 C 4 14 10 20 10 20 l 2 2 L 14 20 C 14 20 20 14 20 8 C 20 4 16.969 0 12 0 Z" 
          fill="${color}" filter="url(#pinShadow)"/>
        <circle cx="12" cy="8" r="3" fill="white"/>
      </g>
    </svg>
  `,
    className: "neat-pin",
    iconSize: [24, 36],
    iconAnchor: [12, 28], // anchor at tip
  });
