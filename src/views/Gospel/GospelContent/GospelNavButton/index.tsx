import { useIsMobile } from "@hooks/useIsMobile";
import { Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TTButton from "@components/TTButton";

type GospelNavButtonProps = {
  label?: string;
  isWriting?: boolean;
  showInPc?: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  handleBack: () => void;
  handleBackHome: () => void;
};

const GospelNavButton = ({
  label,
  isWriting = false,
  showInPc = true,
  setIsHidden,
  handleBack,
  handleBackHome,
}: GospelNavButtonProps) => {
  // window
  const isMobile = useIsMobile();

  return isMobile ? (
    <TTButton
      onClick={() => setIsHidden(false)}
      startIcon={<MenuIcon />}
      variant="text"
      size="large"
      color="utility"
    >
      {Boolean(label) && label}
    </TTButton>
  ) : showInPc ? (
    <Typography
      className="back-text"
      onClick={isWriting ? handleBack : handleBackHome}
    >
      {isWriting ? `<< Back to Topic` : `<< Back to Home`}
    </Typography>
  ) : undefined;
};

export default GospelNavButton;
