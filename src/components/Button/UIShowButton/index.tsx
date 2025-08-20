import TTIconButton from "@components/TTIconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import "./index.scss";

type UIShowButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

const UIShowButton = ({ isOpen, onClick }: UIShowButtonProps) => {
  return (
    <TTIconButton className="ui-show-button" onClick={onClick}>
      {isOpen ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
    </TTIconButton>
  );
};

export default UIShowButton;
