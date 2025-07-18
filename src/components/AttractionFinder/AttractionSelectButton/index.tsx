import TTButton from "@components/TTButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./index.scss";
import { CircularProgress } from "@mui/material";

type AttractionSelectButtonProps = {
  focusId: string | undefined;
  isAttractionLoading: boolean;
  onClick: () => void;
};

const AttractionSelectButton = ({
  focusId,
  isAttractionLoading,
  onClick,
}: AttractionSelectButtonProps) => {
  const endIcon = isAttractionLoading ? (
    <CircularProgress size="1rem" sx={{ color: "white" }} />
  ) : (
    <NavigateNextIcon />
  );
  const handleClick = isAttractionLoading ? () => {} : onClick;

  return (
    <TTButton
      className="attraction-select-button"
      endIcon={endIcon}
      disabled={!Boolean(focusId)}
      onClick={handleClick}
    >
      Select
    </TTButton>
  );
};

export default AttractionSelectButton;
