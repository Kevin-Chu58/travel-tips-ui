import { createTheme } from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily: [
            "noto serif",
            "Arial",
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
        // same as primary
        // success: {
        //     main: "#E4572E",
        //     100: "#FADED5",
        //     200: "#F4BDAC",
        //     300: "#EF9C82",
        //     400: "#E97B59",
        //     500: "#E4572E",
        //     600: "#C34119",
        //     700: "#923113",
        //     800: "#61200D",
        //     900: "#311006"
        // },
        // info: {
        //     main: "#404E7C",
        //     100: "#D5D9E9",
        //     200: "#AAB4D3",
        //     300: "#808EBD",
        //     400: "#5669A7",
        //     500: "#404E7C",
        //     600: "#333F64",
        //     700: "#262F4B",
        //     800: "#1A1F32",
        //     900: "#0D1019"
        // },
        // warning: {
        //     main: "#FF7F11",
        //     100: "#FFE5CF",
        //     200: "#FFCC9F",
        //     300: "#FFB26F",
        //     400: "#FF993F",
        //     500: "#FF7F11",
        //     600: "#D86500",
        //     700: "#A24C00",
        //     800: "#6C3200",
        //     900: "#361900"
        // },
        // // same as warning
        // error: {
        //     main: "#FF7F11",
        //     100: "#FFE5CF",
        //     200: "#FFCC9F",
        //     300: "#FFB26F",
        //     400: "#FF993F",
        //     500: "#FF7F11",
        //     600: "#D86500",
        //     700: "#A24C00",
        //     800: "#6C3200",
        //     900: "#361900"
        // }
    }
});

export default theme;