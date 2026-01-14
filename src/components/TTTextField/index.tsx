import { TextField, type TextFieldProps } from "@mui/material";
import TTIconButton from "@components/TTIconButton";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import clsx from "clsx";
import "./index.scss";

type TTTextFieldProps = {
  id?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  size?: TextFieldProps["size"];
  color?: TextFieldProps["color"];
  label?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  clearInput?: () => void;
  onEnterDown?: () => void;
};

const TTTextField = ({
  id,
  ref,
  className,
  size = "medium",
  color = "utility",
  label,
  value,
  placeholder,
  disabled = false,
  autoFocus = false,
  fullWidth = false,
  multiline = false,
  onChange,
  onKeyDown,
  onClick,
  clearInput,
}: TTTextFieldProps) => {
  const isInputEmpty = () => {
    return !value || value.length === 0;
  };

  return (
    <React.Fragment>
      <TextField
        id={id}
        ref={ref}
        size={size}
        className={className}
        color={color}
        label={label}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        fullWidth={fullWidth}
        multiline={multiline}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onClick={onClick}
      />
      {clearInput && (
        <TTIconButton
          className={clsx(
            "TTTextfield-icon-button",
            !isInputEmpty() && "pointer"
          )}
          onClick={clearInput}
        >
          <ClearIcon
            className={clsx(
              "TTTextfield-clear-icon",
              isInputEmpty() && "hidden"
            )}
            sx={{ color: color }}
          />
        </TTIconButton>
      )}
    </React.Fragment>
  );
};

export default TTTextField;
