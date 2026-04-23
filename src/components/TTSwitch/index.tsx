import { Switch } from "@mui/material";
import "./index.scss";

type TTSwitchProps = {
  checked?: boolean | undefined;
  onChange: (state?: any) => void;
};

const TTSWitch = ({ checked, onChange }: TTSwitchProps) => {
  return (
    <Switch className="TT-switch" checked={checked} onChange={onChange} />
  );
};

export default TTSWitch;
