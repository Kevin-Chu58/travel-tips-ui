import { Chip, type ChipProps } from "@mui/material";

const defaultSx = {
    cursor: "pointer",
    ":hover": {
        color: "white",
        bgcolor: "primary.main",
        ".MuiChip-icon": {
            color: "white",
        },
    },
};

const TTChipButton = ({ sx, ...props }: ChipProps) => {
    return <Chip {...props} sx={{ ...defaultSx, ...sx }} />;
};

export default TTChipButton;
