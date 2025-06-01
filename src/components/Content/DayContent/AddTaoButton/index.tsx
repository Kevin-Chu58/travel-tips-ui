import TTChipButton from "@components/TTChipButton";
import { Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type AddTaoButtonProps = {
    onClick: () => void;
}

const AddTaoButton = ({onClick}: AddTaoButtonProps) => {
    return (
        <TTChipButton
            onClick={onClick}
            icon={<AddIcon />}
            label={<Typography>New Attraction</Typography>}
            sx={{
                width: 200,
                mx: "auto"
            }}
        />
    )
};

export default AddTaoButton;
