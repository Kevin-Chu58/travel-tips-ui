import TTDialog from "@components/TTDialog";
import { Box, Divider, Typography, type ButtonOwnProps } from "@mui/material";
import { useCallback, useEffect, useState, type JSX } from "react";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import TTButton from "@components/TTButton";
import clsx from "clsx";
import "./index.scss";

type FormBaseLayoutProps = {
  width?: string; // vw
  minWidth?: number; // px
  height?: string; // vh
  maxHeight?: string; // vh
  panel?: boolean; // panel has circular border, divider between header and content, and circular action button
};

type FormBaseThemeProps = {
  headerTheme?: ButtonOwnProps["color"];
  closeButtonTheme?: ButtonOwnProps["color"];
  actionButtonTheme?: ButtonOwnProps["color"];
};

type FormBaseHeaderProps = {
  header?: boolean;
  title?: string | JSX.Element;
  subTitle?: string | JSX.Element;
};

type FormBaseButtonProps = {
  closeButtonLabel?: string;
  actionButtonLabel?: string;
  closeButtonVariant?: ButtonOwnProps["variant"];
  actionButtonVariant?: ButtonOwnProps["variant"];
  closeButtonStartIcon?: JSX.Element;
  actionButtonStartIcon?: JSX.Element;
  closeButtonEndIcon?: JSX.Element;
  actionButtonEndIcon?: JSX.Element;
  actionButtonOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  disableActionButton?: boolean;
};

type FormBaseProps = FormBaseLayoutProps &
  FormBaseThemeProps &
  FormBaseHeaderProps &
  FormBaseButtonProps & {
    open: boolean;
    onClose: () => void;
    className?: string;
    isLoading?: boolean;
    children: JSX.Element | JSX.Element[];
  };

const FormBase = ({
  open,
  onClose,
  className,
  isLoading = false,
  children,
  // layout
  width,
  minWidth = 280,
  height,
  maxHeight = "60vh",
  panel = false,
  //theme
  headerTheme,
  closeButtonTheme = "utility",
  actionButtonTheme = "utility",
  //header
  header = true,
  title,
  subTitle,
  // buttons
  closeButtonLabel = "Cancel",
  actionButtonLabel,
  closeButtonVariant = "text",
  actionButtonVariant = "contained",
  closeButtonStartIcon,
  actionButtonStartIcon,
  closeButtonEndIcon,
  actionButtonEndIcon,
  actionButtonOnClick,
  disableActionButton,
}: FormBaseProps) => {
  // ref
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);
  const contentRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setContentEl(node); // triggers re-render
    }
  }, []);

  // rerender event listener by scroll on contentEl
  useEffect(() => {
    if (!open) return;
    if (!contentEl) return;

    const footerEl = contentEl.nextSibling as HTMLDivElement;

    const handleScroll = () => {
      const overflowClassName = "content-overflow";

      const isOverflow = BehaviorUtils.isVerticallyOverflowing(contentEl);
      const isAtBottom = BehaviorUtils.isScrollbarAtBottom(contentEl);

      if (isOverflow && !isAtBottom) {
        footerEl?.classList.add(overflowClassName);
      } else {
        footerEl?.classList.remove(overflowClassName);
      }
    };

    // run once immediately
    handleScroll();

    contentEl.addEventListener("scroll", handleScroll);

    return () => {
      contentEl.removeEventListener("scroll", handleScroll);
    };
  }, [contentEl]);

  return (
    <TTDialog
      className={className}
      open={open}
      onClose={onClose}
      panel={panel}
      hidePadding={panel}
      disableAutoFocus
      disableRestoreFocus
    >
      <Box
        className="form-base-container"
        width={width}
        minWidth={minWidth}
        height={height}
        maxHeight={maxHeight}
      >
        {/* header */}
        {header ? (
          <Box className={clsx("header", panel && "panel")}>
            {title ? (
              <Typography className="title" color={headerTheme} variant="h5">
                {title}
              </Typography>
            ) : undefined}
            {subTitle ? (
              <Typography
                className="subtitle"
                color={headerTheme}
                variant="subtitle2"
              >
                {subTitle}
              </Typography>
            ) : undefined}
          </Box>
        ) : undefined}

        {panel && title ? (
          <Divider className="divider" variant="middle" flexItem />
        ) : undefined}

        {/* content */}
        <Box ref={contentRef} className="content">
          {children}
        </Box>

        {/* buttons */}
        <Box className={clsx("footer")}>
          <Box className="buttons">
            {closeButtonLabel != "" ? (
              <TTButton
                variant={closeButtonVariant}
                color={closeButtonTheme ?? "inherit"}
                startIcon={closeButtonStartIcon}
                endIcon={closeButtonEndIcon}
                onClick={onClose}
                circular={panel}
              >
                {closeButtonLabel}
              </TTButton>
            ) : undefined}
            {actionButtonLabel ? (
              <TTButton
                variant={actionButtonVariant}
                color={actionButtonTheme}
                startIcon={actionButtonStartIcon}
                endIcon={actionButtonEndIcon}
                onClick={actionButtonOnClick}
                disabled={disableActionButton}
                loading={isLoading}
                circular={panel}
              >
                {actionButtonLabel}
              </TTButton>
            ) : undefined}
          </Box>
        </Box>
      </Box>
    </TTDialog>
  );
};

export default FormBase;
