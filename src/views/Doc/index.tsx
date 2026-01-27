import { Box, Container, Divider, Typography } from "@mui/material";
import type { NavTab } from "@constants/Types";
import { Route, Routes, useNavigate } from "react-router";
import FoundationProfile from "@components/Profile/UserAgreementProfile/FoundationProfile";
import TermsOfServiceProfile from "@components/Profile/UserAgreementProfile/TermsOfServiceProfile";
import PrivacyPolicyProfile from "@components/Profile/UserAgreementProfile/PrivacyPolicyProfile";
import { useLocation } from "react-router";
import TTButton from "@components/TTButton";
import Guide from "./Guide";
import React from "react";
import clsx from "clsx";
import "./index.scss";

const Doc = () => {
  // others
  const navigate = useNavigate();
  const location = useLocation();
  const isMain = location.pathname === "/doc";

  const userAgreementSection = [
    {
      name: "foundation",
      label: "Christian Foundation",
      description: "The values that shape the platform",
      to: "foundation",
      element: <FoundationProfile readonly />,
    },
    {
      name: "terms-of-service",
      label: "Terms of Service",
      description:
        "The specific content standards and terms from Christian values",
      to: "terms-of-service",
      element: <TermsOfServiceProfile readonly />,
    },
    {
      name: "privacy-policy",
      label: "Privacy Policy",
      description: "How we collect, use, and protect your data",
      to: "privacy-policy",
      element: <PrivacyPolicyProfile readonly />,
    },
  ] as NavTab[];

  const guideSection = [
    {
      name: "guide",
      label: "General",
      description: "How to use the app step by step",
      to: "guide",
      element: <Guide />,
    },
  ] as NavTab[];

  const Main = (
    <React.Fragment>
      <Typography variant="h4">Documentation</Typography>
      {/* user agreement */}
      <Typography className="section-header" variant="h5">
        User Agreement
      </Typography>
      <Box className="content-box">
        {userAgreementSection.map((sec) => (
          <Box
            key={sec.name}
            className="doc-content"
            onClick={() => (sec.to ? navigate(sec.to) : {})}
          >
            <Typography variant="h6">{sec.label}</Typography>
            <Divider flexItem />
            <Typography>{sec.description}</Typography>
          </Box>
        ))}
      </Box>

      {/* Guide */}
      <Typography className="section-header" variant="h5">
        Guide
      </Typography>
      <Box className="content-box">
        {guideSection.map((sec) => (
          <Box
            key={sec.name}
            className="doc-content"
            onClick={() => (sec.to ? navigate(sec.to) : {})}
          >
            <Typography variant="h6">{sec.label}</Typography>
            <Divider flexItem />
            <Typography>{sec.description}</Typography>
          </Box>
        ))}
      </Box>
    </React.Fragment>
  );

  const mainSection = {
    name: "main",
    to: "",
    element: Main,
  };

  const routes = [mainSection, ...userAgreementSection, ...guideSection];

  return (
    <Container
      className={clsx("doc-container", !isMain && "section")}
      maxWidth={false}
    >
      <Box className={clsx("container-box", !isMain && "section")}>
        <Box className="contents-box">
          <Box>
            {!isMain ? (
              <TTButton
                label="< back"
                color="utility"
                onClick={() => navigate("/doc")}
              />
            ) : undefined}
          </Box>
          <Routes>
            {routes.map((route) => (
              <Route key={route.name} path={route.to} element={route.element} />
            ))}
          </Routes>
        </Box>
      </Box>
    </Container>
  );
};

export default Doc;
