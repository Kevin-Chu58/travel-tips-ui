import { Box, Container } from "@mui/material";
import FoundationProfile from "@components/Profile/UserAgreementProfile/FoundationProfile";
import TermsOfServiceProfile from "@components/Profile/UserAgreementProfile/TermsOfServiceProfile";
import PrivacyPolicyProfile from "@components/Profile/UserAgreementProfile/PrivacyPolicyProfile";
import "./index.scss";

const Document = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Box className="document-container">
        <Box className="document-content-container">
          <FoundationProfile readonly />
          <TermsOfServiceProfile readonly />
          <PrivacyPolicyProfile readonly />
        </Box>
      </Box>
    </Container>
  );
};

export default Document;
