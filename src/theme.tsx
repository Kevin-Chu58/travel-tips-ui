import { createTheme } from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily: [
            "noto serif",
            "arial",
            "tagesschrift",
            "lily script one",
            "fascinate inline",
        ].join(','),
    },
    palette: {
        primary: {
            main: "#E4572E",
            100: "#FADED5",
            200: "#F4BDAC",
            300: "#EF9C82",
            400: "#E97B59",
            500: "#E4572E",
            600: "#C34119",
            700: "#923113",
            800: "#61200D",
            900: "#311006"
        },
        secondary: {
            main: "#F2EFEA",
            100: "#FCFCFB",
            200: "#FAF8F6",
            300: "#F7F5F2",
            400: "#F4F2ED",
            500: "#F2EFEA",
            600: "#CDC2AE",
            700: "#A99673",
            800: "#766548",
            900: "#3B3224"
        },
    }
});

export default theme;