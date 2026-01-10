import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface PaletteColor {
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
  }

  interface Palette {
    region: Palette["primary"];
    utility: Palette["primary"];
  }

  interface PaletteOptions {
    region?: PaletteOptions["primary"];
    utility?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    region: true;
    utility: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    region: true;
    utility: true;
  }
}

declare module "@mui/material/InputBase" {
  interface InputBasePropsColorOverrides {
    region: true;
    utility: true;
  }
}

declare module "@mui/material/FormLabel" {
  interface FormLabelPropsColorOverrides {
    region: true;
    utility: true;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsColorOverrides {
    region: true;
    utility: true;
  }
}

declare module "@mui/material/Badge" {
  interface BadgePropsColorOverrides {
    region: true;
    utility: true;
  }
}

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

export const info = {
  main: "#2196f3",
  50: "#e3f2fd",
  100: "#bbdefb",
  200: "#90caf9",
  300: "#64b5f6",
  400: "#42a5f5",
  500: "#2196f3",
  600: "#1e88e5",
  700: "#1976d2",
  800: "#1565c0",
  900: "#0d47a1",
};

export const success = {
  main: "#4caf50",
  50: "#e8f5e9",
  100: "#c8e6c9",
  200: "#a5d6a7",
  300: "#81c784",
  400: "#66bb6a",
  500: "#4caf50",
  600: "#43a047",
  700: "#388e3c",
  800: "#2e7d32",
  900: "#1b5e20",
};

export const region = {
  main: "#880088",
  100: "#FCF7FC",
  200: "#F6EAF6",
  300: "#EFD6EF",
  400: "#E1B8E1",
  500: "#880088",
  600: "#6D006D",
  700: "#520052",
  800: "#360036",
  900: "#1B001B",
};

export const utility = {
  main: "#101010", // intentionally 900
  50: "#f5f5f5",
  100: "#eeeeee",
  200: "#e0e0e0",
  300: "#bdbdbd",
  400: "#9e9e9e",
  500: "#757575",
  600: "#616161",
  700: "#424242",
  800: "#212121",
  900: "#101010",
};

const theme = createTheme({
  typography: {
    fontFamily: [
      "open sans",
      "noto serif",
      "sora",
      "arial",
      "tagesschrift",
      "lily script one",
      "fascinate inline",
    ].join(","),
  },
  palette: {
    primary: primary,
    secondary: secondary,
    info: info,
    success: success,
    region: region,
    utility: utility,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.color === "region" &&
            ownerState.variant === "contained" && {
              borderColor: theme.palette.region.main,
              color: "white",
            }),
          ...(ownerState.color === "utility" &&
            ownerState.variant === "contained" && {
              borderColor: theme.palette.utility[900],
              color: "white",
            }),
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.color === "success" &&
            ownerState.variant === "filled" && {
              backgroundColor: theme.palette.success[100],
              color: theme.palette.success[900],
            }),
          ...(ownerState.color === "info" &&
            ownerState.variant === "filled" && {
              backgroundColor: theme.palette.info[100],
              color: theme.palette.info[900],
            }),
          ...(ownerState.color === "region" && {
            ".MuiChip-deleteIcon": {
              fill: theme.palette.region[800],
            },
          }),
          ...(ownerState.color === "region" &&
            ownerState.variant === "outlined" && {
              backgroundColor: "transparent",
              borderColor: theme.palette.region.main,
              color: theme.palette.region.main,
            }),
          ...(ownerState.color === "region" &&
            ownerState.variant === "filled" && {
              backgroundColor: theme.palette.region[300],
              color: theme.palette.region[800],
              "&:hover": {
                backgroundColor: theme.palette.region[300],
                color: theme.palette.region[800],
              },
            }),
          ...(ownerState.color === "utility" &&
            ownerState.variant === "outlined" && {
              backgroundColor: "transparent",
              borderColor: theme.palette.utility[900],
              color: theme.palette.utility[900],
            }),
          ...(ownerState.color === "utility" &&
            ownerState.variant === "filled" && {
              backgroundColor: theme.palette.utility[900],
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.utility[800],
                color: "white",
              },
            }),
        }),
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: ({ ownerState, theme }) => ({
          ...(ownerState.color === "region" && {
            backgroundColor: theme.palette.region[800],
            color: theme.palette.region[300],
          }),
          ...(ownerState.color === "utility" && {
            backgroundColor: theme.palette.utility[800],
            color: "white",
          }),
        }),
      },
    },
  },
});

export default theme;
