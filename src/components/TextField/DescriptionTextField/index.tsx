import TTButton from "@components/TTButton";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import MarkdownBox from "@components/MarkdownBox";
import ToolTip from "@components/ToolTip";
import { useRef, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaLink,
  FaImage,
} from "react-icons/fa";
import type { UtilityItem } from "@constants/Types";
import { StringUtils } from "@utils/StringUtils";
import clsx from "clsx";
import "./index.scss";

type DescriptionTextFieldProps = {
  value: string;
  setValue: (state: string) => void;
  placeholder?: string;
  maxHeight?: string;
  maxLength?: number;
  isOfficial?: boolean;
};

const DescriptionTextField = ({
  value,
  setValue,
  placeholder,
  maxHeight,
  maxLength,
  isOfficial = false,
}: DescriptionTextFieldProps) => {
  // view
  const [isPreview, setIsPreview] = useState<boolean>(false);
  // input
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
    text: string;
  }>({
    start: 0,
    end: 0,
    text: "",
  });
  // states
  const isBold = StringUtils.isStylingMet(
    selection.text,
    StringUtils.BOLD_IDENT,
  );
  const isItalic = StringUtils.isStylingMet(
    selection.text,
    StringUtils.ITALIC_IDENT,
  );
  const isStrikeThrough = StringUtils.isStylingMet(
    selection.text,
    StringUtils.STRIKE_THROUGH_IDENT,
  );

  // async functions

  const setDefaultSelection = () =>
    setSelection({
      start: 0,
      end: 0,
      text: "",
    });

  const asyncSelection = () => {
    const el = textAreaRef.current;
    if (!el) return;

    const { selectionStart, selectionEnd, value } = el;

    setSelection({
      start: selectionStart,
      end: selectionEnd,
      text:
        selectionStart !== selectionEnd
          ? value.slice(selectionStart, selectionEnd)
          : "",
    });
  };

  const handleStylingClick = (
    isConditionMet: boolean,
    identifier: string,
    isAddIdent: boolean = false,
  ) => {
    if (!isAddIdent && !selection.text) return;

    const identLength = identifier.length;

    const before = value.slice(0, selection.start);
    const after = value.slice(selection.end);

    const newText = isConditionMet
      ? selection.text.slice(identLength, selection.text.length - identLength)
      : isAddIdent
        ? identifier
        : `${identifier}${selection.text}${identifier}`;
    const newValue = `${before}${newText}${after}`;

    setValue(newValue);

    // restore selection AFTER state update
    requestAnimationFrame(() => {
      const el = textAreaRef.current;
      if (!el) return;

      const modifier = isConditionMet ? -identLength : identLength;

      el.focus();
      el.setSelectionRange(selection.start, selection.end + modifier * 2);

      asyncSelection();
    });
  };

  const toolButtons = [
    {
      label: "Bold",
      content: <FaBold />,
      condition: isBold,
      onClick: () => handleStylingClick(isBold, StringUtils.BOLD_IDENT),
    },
    {
      label: "Italic",
      content: <FaItalic />,
      condition: isItalic,
      onClick: () => handleStylingClick(isItalic, StringUtils.ITALIC_IDENT),
    },
    {
      label: "Strike-through",
      content: <FaStrikethrough />,
      condition: isStrikeThrough,
      onClick: () =>
        handleStylingClick(isStrikeThrough, StringUtils.STRIKE_THROUGH_IDENT),
    },
    {
      label: "Add Link",
      content: <FaLink />,
      condition: false,
      onClick: () => handleStylingClick(false, StringUtils.LINK_IDENT, true),
    },
    {
      label: "Add Image",
      content: <FaImage />,
      condition: false,
      onClick: () => handleStylingClick(false, StringUtils.IMAGE_IDENT, true),
    },
  ] as UtilityItem[];

  return (
    <Box className="description-text-field-box">
      <Box className="view-box">
        <TTButton
          label="write"
          variant="text"
          onClick={() => setIsPreview(false)}
          className={`view-button ${!isPreview && "focus"}`}
          disableRipple
        />
        <TTButton
          label="preview"
          variant="text"
          onClick={() => setIsPreview(true)}
          className={`view-button ${isPreview && "focus"}`}
          disableRipple
        />
      </Box>

      {isPreview ? (
        <Box className="preview-box">
          <MarkdownBox text={value} isOfficial={isOfficial} />
        </Box>
      ) : (
        <Box className="text-field-box">
          <Box className="text-field-tool-bar">
            {toolButtons.map((button) => (
              <ToolTip key={button.label} title={button.label} offsetY={-8}>
                <IconButton
                  className={clsx(button.condition && "enabled")}
                  onClick={button.onClick}
                  onMouseDown={(e) => e.preventDefault()} // preserve selection
                >
                  {button.content}
                </IconButton>
              </ToolTip>
            ))}
          </Box>

          <TextField
            className="view-input-text-field"
            value={value}
            sx={{ maxHeight: maxHeight }}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            inputRef={textAreaRef}
            onSelect={asyncSelection}
            onKeyUp={asyncSelection}
            onMouseUp={asyncSelection}
            onBlur={setDefaultSelection}
            multiline
          />

          <Box className="end-adornment">
            <InputAdornment position="end">
              {maxLength ? `${value?.length ?? 0}/${maxLength}` : ""}
            </InputAdornment>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DescriptionTextField;
