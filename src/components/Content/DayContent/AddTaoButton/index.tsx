import TTChipButton from "@components/TTChipButton";
import { Typography, type SxProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type AddTaoButtonProps = {
    onClick: () => void;
    sx?: SxProps;
}

const AddTaoButton = ({onClick, sx}: AddTaoButtonProps) => {
    return (
        <TTChipButton
            onClick={onClick}
            icon={<AddIcon />}
            label={<Typography>New Attraction</Typography>}
            sx={{
                width: 200,
                mx: "auto",
                ...sx,
            }}
        />
    )
};

export default AddTaoButton;
