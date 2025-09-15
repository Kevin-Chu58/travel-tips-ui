import {
  ToggleButton,
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
} from "@mui/material";
import "./index.scss";

type ButtonGroupProps = {
  items: any[];
  focus: any;
  focusParam: string;
  color?: ToggleButtonGroupProps["color"];
  onClick: (...args: any[]) => void;
};

const TTButtonGroup = ({
  items,
  focus,
  focusParam,
  color = "primary",
  onClick,
}: ButtonGroupProps) => {
  return (
    <ToggleButtonGroup
      className="tt-button-group-toggle-button-group"
      color={color}
      value={focus}
      exclusive
    >
      {items.map((item) => (
        <ToggleButton
          className="tt-button-group-toggle-button"
          key={item.name}
          size="small"
          value={item.name}
          onClick={() => onClick(item[focusParam])}
          disableRipple
        >
          {item.element}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default TTButtonGroup;
