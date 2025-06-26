import {
  Button,
  ButtonGroup,
} from "@mui/material";

type ButtonGroupProps = {
  items: any[];
  focus: any;
  focusParam: string;
  onClick: (...args: any[]) => void;
};

const TTButtonGroup = ({items, focus, focusParam, onClick}: ButtonGroupProps) => {
  return (
    <ButtonGroup>
      {items.map((item) => (
        <Button
          key={item.name}
          size="small"
          color="secondary"
          variant={focus === item[focusParam] ? "contained" : "outlined"}
          onClick={() => onClick(item[focusParam])}
          disableRipple
        >
          {item.element}
        </Button>
      ))}
    </ButtonGroup>
  )
};

export default TTButtonGroup;
