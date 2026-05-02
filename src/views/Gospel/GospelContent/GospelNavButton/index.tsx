import TTIconButton from "@components/TTIconButton";
import { useIsMobile } from "@hooks/useIsMobile";
import { Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

type GospelNavButtonProps = {
  isWriting?: boolean;
  showInPc?: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  handleBack: () => void;
  handleBackHome: () => void;
};

const GospelNavButton = ({
  isWriting = false,
  showInPc = true,
  setIsHidden,
  handleBack,
  handleBackHome,
}: GospelNavButtonProps) => {
  // window
  const isMobile = useIsMobile();

  return isMobile ? (
    <TTIconButton onClick={() => setIsHidden(false)} noBorder>
      <MenuIcon />
    </TTIconButton>
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
