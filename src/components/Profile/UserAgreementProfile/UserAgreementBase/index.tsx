import { Box, Divider, Typography } from "@mui/material";
import crossSvg from "@assets/cross.svg";
import type { JSX } from "react";
import TTButton from "@components/TTButton";
import React from "react";
import "./index.scss";

type UserAgreementBaseButtonProps = {
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  back?: () => void;
  next?: () => void;
};

type UserAgreementBaseProps = UserAgreementBaseButtonProps & {
  header?: string;
  subHeader: string;
  children: JSX.Element;
  checkingChildren?: JSX.Element;
  nextHelperNote?: string;
  readonly?: boolean;
  showCross?: boolean;
};

const UserAgreementBase = ({
  header = "User Agreement",
  subHeader,
  children,
  checkingChildren,
  nextHelperNote,
  readonly = false,
  showCross = true,
  // buttons
  backLabel,
  nextLabel = "Proceed",
  nextDisabled = false,
  back,
  next,
}: UserAgreementBaseProps) => {
  return (
    <Box className="user-agreement-base-container">
      {/* header */}
      <Box className="header-container">
        <Box className="header-content-container">
          {showCross ? <img src={crossSvg} height={48} /> : undefined}
          <Box>
            <Typography variant="h5">{header}</Typography>
            <Typography fontStyle="italic">{subHeader}</Typography>
          </Box>
        </Box>
      </Box>
      {/* content */}
      <Box className="content-container">{children}</Box>

      {/* agreement checking */}
      {!readonly ? (
        <React.Fragment>
          <Divider flexItem variant="middle" />
          <Box className="checking-container">
            {checkingChildren}

            {/* buttons */}
            <Box className="checking-content-container">
              {backLabel ? (
                <TTButton circular variant="outlined" onClick={back}>
                  {backLabel}
                </TTButton>
              ) : undefined}
              {nextLabel ? (
                <Box className="next-button-box">
                  {nextHelperNote ? (
                    <Typography className="checking-helper">
                      Next: {nextHelperNote}
                    </Typography>
                  ) : undefined}
                  <TTButton
                    className="checkbox-button"
                    circular
                    disabled={nextDisabled}
                    onClick={next}
                  >
                    {nextLabel}
                  </TTButton>
                </Box>
              ) : undefined}
            </Box>
          </Box>
        </React.Fragment>
      ) : undefined}
    </Box>
  );
};

export default UserAgreementBase;
