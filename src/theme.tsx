import { createTheme } from "@mui/material";

export const primary = {
  main: "#E4572E",
  100: "#FADED5",
  200: "#F4BDAC",
  300: "#EF9C82",
  400: "#E97B59",
  500: "#E4572E",
  600: "#C34119",
  700: "#923113",
  800: "#61200D",
  900: "#311006",
};

// Primary = MUI default error palette
// export const primary = {
//   main: "#f44336", // red[500]
//   50:  "#ffebee",
//   100: "#ffcdd2",
//   200: "#ef9a9a",
//   300: "#e57373",
//   400: "#ef5350",
//   500: "#f44336",
//   600: "#e53935",
//   700: "#d32f2f",
//   800: "#c62828",
//   900: "#b71c1c",
// };

export const secondary = {
  main: "#F2EFEA",
  100: "#FCFCFB",
  200: "#FAF8F6",
  300: "#F7F5F2",
  400: "#F4F2ED",
  500: "#F2EFEA",
  600: "#CDC2AE",
  700: "#A99673",
  800: "#766548",
  900: "#3B3224",
};

// export const info = {
//   main: "#2196f3", // blue[500]
//   50:  "#e3f2fd",
//   100: "#bbdefb",
//   200: "#90caf9",
//   300: "#64b5f6",
//   400: "#42a5f5",
//   500: "#2196f3",
//   600: "#1e88e5",
//   700: "#1976d2",
//   800: "#1565c0",
//   900: "#0d47a1",
// };

// Error = black/grey scale
// export const error = {
//   main: "#212121",
//   50:  "#fafafa",
//   100: "#f5f5f5",
//   200: "#eeeeee",
//   300: "#e0e0e0",
//   400: "#bdbdbd",
//   500: "#9e9e9e",
//   600: "#757575",
//   700: "#616161",
//   800: "#424242",
//   900: "#212121",
// };

const theme = createTheme({
  typography: {
    fontFamily: [
      "open sans",
      "noto serif",
      "arial",
      "tagesschrift",
      "lily script one",
      "fascinate inline",
    ].join(","),
  },
  palette: {
    primary: primary,
    secondary: secondary,
    // error: error,
  },
});

export default theme;
