import TTButton from "@components/TTButton";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import ToolTip from "@components/ToolTip";
import React, { Suspense, useRef, useState } from "react";
import {
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuList,
  LuListOrdered,
  LuLink,
  LuImage,
  LuHeading1,
  LuHeading2,
  LuHeading3,
} from "react-icons/lu";
import type { UtilityItem } from "@constants/Types";
import { StringUtils } from "@utils/StringUtils";
import clsx from "clsx";
import "./index.scss";

// lazy load
const MarkdownBox = React.lazy(() => import("@components/MarkdownBox"));

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
  const isHeader1 = StringUtils.isStylingMet(
    selection.text,
    StringUtils.HEADER1_IDENT,
    true,
  );
  const isHeader2 = StringUtils.isStylingMet(
    selection.text,
    StringUtils.HEADER2_IDENT,
    true,
  );
  const isHeader3 = StringUtils.isStylingMet(
    selection.text,
    StringUtils.HEADER3_IDENT,
    true,
  );
  const isList = StringUtils.isStylingMet(
    selection.text,
    StringUtils.LIST_IDENT,
    true,
  );
  const isOrderedList = StringUtils.isStylingMet(
    selection.text,
    StringUtils.LIST_ORDERED_IDENT,
    true,
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
    prefix?: boolean,
    suffix?: boolean,
  ) => {
    const identLength = identifier.length;

    const before = value.slice(0, selection.start);
    const after = value.slice(selection.end);

    const newText = isConditionMet
      ? selection.text.slice(
          prefix !== false ? identLength : 0,
          suffix !== false
            ? selection.text.length - identLength
            : selection.text.length,
        )
      : isAddIdent
        ? identifier
        : `${prefix !== false ? identifier : ""}${selection.text}${suffix !== false ? identifier : ""}`;

    const newValue = `${before}${newText}${after}`;

    setValue(newValue);

    // restore selection AFTER state update
    requestAnimationFrame(() => {
      const el = textAreaRef.current;
      if (!el) return;

      const modifier = isConditionMet ? -identLength : identLength;
      const modScale = isAddIdent || prefix || suffix ? 1 : 2;

      el.focus();
      el.setSelectionRange(
        selection.start,
        selection.end + modifier * modScale,
      );

      asyncSelection();
    });
  };

  const toolButtons = [
    {
      label: "Bold",
      content: <LuBold />,
      condition: isBold,
      onClick: () => handleStylingClick(isBold, StringUtils.BOLD_IDENT),
    },
    {
      label: "Italic",
      content: <LuItalic />,
      condition: isItalic,
      onClick: () => handleStylingClick(isItalic, StringUtils.ITALIC_IDENT),
    },
    {
      label: "Strike-through",
      content: <LuStrikethrough />,
      condition: isStrikeThrough,
      onClick: () =>
        handleStylingClick(isStrikeThrough, StringUtils.STRIKE_THROUGH_IDENT),
    },
    {
      label: "Header 1",
      content: <LuHeading1 />,
      condition: isHeader1,
      onClick: () =>
        handleStylingClick(
          isHeader1,
          StringUtils.HEADER1_IDENT,
          false,
          true,
          false,
        ),
    },
    {
      label: "Header 2",
      content: <LuHeading2 />,
      condition: isHeader2,
      onClick: () =>
        handleStylingClick(
          isHeader2,
          StringUtils.HEADER2_IDENT,
          false,
          true,
          false,
        ),
    },
    {
      label: "Header 3",
      content: <LuHeading3 />,
      condition: isHeader3,
      onClick: () =>
        handleStylingClick(
          isHeader3,
          StringUtils.HEADER3_IDENT,
          false,
          true,
          false,
        ),
    },
    {
      label: "Unordered List",
      content: <LuList />,
      condition: isList,
      onClick: () =>
        handleStylingClick(isList, StringUtils.LIST_IDENT, false, true, false),
    },
    {
      label: "Ordered List",
      content: <LuListOrdered />,
      condition: isOrderedList,
      onClick: () =>
        handleStylingClick(
          isOrderedList,
          StringUtils.LIST_ORDERED_IDENT,
          false,
          true,
          false,
        ),
    },
    {
      label: "Add Link",
      content: <LuLink />,
      condition: false,
      onClick: () => handleStylingClick(false, StringUtils.LINK_IDENT, true),
    },
    {
      label: "Add Image",
      content: <LuImage />,
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
          <Suspense fallback={<Box>{value}</Box>}>
            <MarkdownBox text={value} isOfficial={isOfficial} />
          </Suspense>
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
