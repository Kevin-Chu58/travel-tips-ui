import { Box, Checkbox, Divider, Typography } from "@mui/material";
import crossSvg from "@assets/cross.svg";
import { useState } from "react";
import TTButton from "@components/TTButton";

type PrivacyPolicyProfileProps = {
  readonly?: boolean;
  next?: () => void;
  back?: () => void;
};

const PrivacyPolicyProfile = ({
  readonly = false,
  next,
  back,
}: PrivacyPolicyProfileProps) => {
  // checkbox
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <Box className="user-agreement-profile-container">
      {/* header */}
      <Box className="user-agreement-profile-header-container">
        <Box className="user-agreement-profile-header-content-container">
          <img src={crossSvg} height={48} />
          <Box>
            <Typography variant="h5">User Agreement</Typography>
            <Typography fontStyle="italic">Privacy Policy</Typography>
          </Box>
        </Box>
      </Box>

      <Box className="user-agreement-profile-content-container">
        {/* introduction */}
        <Typography>
          <b>Last Updated:</b> 12/9/2025
        </Typography>
        <Typography className="user-agreement-profile-content">
          TravelTips (“we”, “our” “us”) is committed to protecting your privacy.
          <br />
          <br />
          This Privacy Policy explains how we collect, use, store, share, and
          protect your information when you use the TravelTips website or mobile
          application (“the App”).
          <br />
          <br />
          By accessing or using the App, you consent to the practices described
          in this Privacy Policy.
        </Typography>

        {/* section 1 */}
        <Typography variant="h6">1. Information We Collect</Typography>
        <Typography className="user-agreement-profile-content">
          We collect the following types of information:
        </Typography>
        <Typography variant="subtitle1">
          1.1 Information You Provide to Us
        </Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          When you create an account or use user-only features, we may collect:
          <ul>
            <li>Name or username</li>
            <li>Email address</li>
            <li>Profile information</li>
            <li>
              Any content you submit (tips, reviews, images, comments, etc.)
            </li>
            <li>Optional travel preferences</li>
          </ul>
        </Typography>
        <Typography variant="subtitle1">
          1.2 Automatically Collected Information
        </Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          When you access the App, we may automatically collect:
          <ul>
            <li>IP address</li>
            <li>Browser type and device information</li>
            <li>Operating system</li>
            <li>Pages you visit</li>
            <li>Time and date of access</li>
            <li>Clickstream data</li>
            <li>Approximate location (if enabled)</li>
          </ul>
        </Typography>
        <Typography variant="subtitle1">
          1.3 Cookies and Tracking Technologies
        </Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          We use cookies and similar tools to:
          <ul>
            <li>Remember your preferences</li>
            <li>Maintain your login session</li>
            <li>Analyze usage and traffic patterns</li>
            <li>Improve the App experience</li>
          </ul>
          <i>Cookies for advertisement are under Section 11 [link].</i>
          <br />
          <br />
          You can disable cookies in your browser, but some features may not
          work correctly.
        </Typography>

        {/* section 2 */}
        <Typography variant="h6">2. How We Use Your Information</Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          We may use collected information to:
          <ul>
            <li>Provide, operate, and maintain the App</li>
            <li>Create and manage user accounts</li>
            <li>Display user-submitted travel content</li>
            <li>Improve user experience and platform features</li>
            <li>Communicate with you about updates or account matters</li>
            <li>
              Monitor and enforce compliance with our <b>Terms of Service</b>
            </li>
            <li>Protect against fraud, abuse, and security threats</li>
            <li>Analyze usage trends and performance</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Typography>

        {/* section 3 */}
        <Typography variant="h6">3. How We Share Your Information</Typography>
        <Typography className="user-agreement-profile-content">
          We do <b>not</b> sell your personal information.
          <br />
          <br />
          We may share information with:
        </Typography>
        <Typography variant="subtitle1">3.1 Service Providers</Typography>
        <Typography className="user-agreement-profile-content">
          Trusted vendors who help us operate the App (hosting, analytics, email
          services, etc.).
        </Typography>
        <Typography variant="subtitle1">3.2 Legal Requirements</Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          We may disclose information if required to:
          <ul>
            <li>Comply with applicable laws</li>
            <li>Respond to lawful requests</li>
            <li>Protect our rights, safety, or users</li>
            <li>Prevent fraud or security breaches</li>
          </ul>
        </Typography>
        <Typography variant="subtitle1">3.3 User-Submitted Content</Typography>
        <Typography className="user-agreement-profile-content">
          Any content you choose to make public (trips, photos, highlights) can
          be viewed by others.
        </Typography>

        {/* section 4 */}
        <Typography variant="h6">4. Data Storage and Security</Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          We take reasonable technical and administrative measures to protect
          your data from:
          <ul>
            <li>Unauthorized access</li>
            <li>Theft</li>
            <li>Loss</li>
            <li>Misuse</li>
            <li>alteration</li>
          </ul>
          However, no system is 100% secure.
          <br />
          You are responsible for maintaining the confidentiality of your
          password.
        </Typography>

        {/* section 5 */}
        <Typography variant="h6">5. Your Choices and Rights</Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          Depending on your location, you may have the right to:
          <ul>
            <li>Access a copy of your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
            <li>Request restriction of processing</li>
            <li>Opt-out of analytics or cookies</li>
            <li>
              Request a copy of your data in portable format (not deployed yet)
            </li>
          </ul>
          To exercise any rights, contact us at: [email]
        </Typography>

        {/* section 6 */}
        <Typography variant="h6">6. Data Retention</Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          We retain data for as long as necessary to:
          <ul>
            <li>Operate the App</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce agreements</li>
          </ul>
          User-generated content may remain publicly visible unless you delete
          it or mark it as private or is removed due to content violation.
        </Typography>

        {/* section 7 */}
        <Typography variant="h6">7. Children's Privacy</Typography>
        <Typography className="user-agreement-profile-content">
          TravelTips is not intended for children under 13.
          <br />
          <br />
          We do not knowingly collect personal information from children under
          13.
          <br />
          If we discover such data, we will delete it promptly.
        </Typography>

        {/* section 8 */}
        <Typography variant="h6">8. International Data Transfers</Typography>
        <Typography className="user-agreement-profile-content">
          Your information may be processed or stored in servers located outside
          your country.
          <br />
          <br />
          By using the App, you consent to such transfers, which may involve
          regions with different data protection laws.
        </Typography>

        {/* section 9 */}
        <Typography variant="h6">
          9. Third-Party Websites and Services
        </Typography>
        <Typography className="user-agreement-profile-content">
          The App may contain links to external sites not operated by
          TravelTips.
          <br />
          <br />
          We are not responsible for the content, privacy practices, or security
          of third-party websites.
        </Typography>

        {/* section 10 */}
        <Typography variant="h6">10. Changes to This Privacy Policy</Typography>
        <Typography className="user-agreement-profile-content">
          We may update this Privacy Policy from time to time.
          <br />
          <br />
          If changes are significant, we will notify you by email or through the
          App.
          <br />
          Your continued use of the App constitutes acceptance of the updated
          policy.
        </Typography>

        {/* section 11 */}
        <Typography variant="h6">11. Advertising and Cookies</Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          The App may use third-party advertising services, including Google Ads
          and Google AdSense, which may use cookies, web beacons, or similar
          tracking technologies to display personalized advertisements based on
          your interests.
          <br />
          <br />
          These advertising partners may collect information including:
          <ul>
            <li>IP address</li>
            <li>Device identifiers</li>
            <li>Browsing behavior</li>
            <li>App usage statistics</li>
            <li>General (non-precise) location</li>
          </ul>
          This information is used to:
          <ul>
            <li>Measure ad performance</li>
            <li>Prevent fraud</li>
            <li>Personalize ads (if allowed by law)</li>
          </ul>
        </Typography>
        <Typography variant="subtitle1">
          11.1 Google Advertising Cookies
        </Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          Google may use the following cookies and technologies:
          <ul>
            <li>Google Ads cookies</li>
            <li>DoubleClick (IDE) cookie</li>
            <li>Google Analytics advertising features</li>
          </ul>
          Google's use of advertising cookies enables:
          <ul>
            <li>Interest-based ads</li>
            <li>Frequency capping</li>
            <li>Conversion tracking</li>
            <li>Remarketing</li>
          </ul>
          Users may learn more about Google's data use at:{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://policies.google.com/technologies/partner-sites
          </a>
        </Typography>
        <Typography variant="subtitle1">11.2 Your Choices</Typography>
        <Typography
          component="div"
          className="user-agreement-profile-content"
        >
          Depending on your location, you may:
          <ul>
            <li>Opt out of personalized ads</li>
            <li>Reject advertising cookies</li>
            <li>Use browser settings to block third-party cookies</li>
            <li>Use Google's Ad settings to manage ad preferences</li>
          </ul>
          To opt out of personalized ads from Google, visit:{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.google.com/settings/ads
          </a>
          <br />
          TravelTips will display cookie consent options where required by law.
          (not yet implemented)
        </Typography>

        {/* section 12 */}
        <Typography variant="h6">12. Contact Us</Typography>
        <Typography className="user-agreement-profile-content">
          If you have questions about this Privacy Policy, or want to exercise
          your rights, contact us at:
          <br />
          <br />
          [company name]<br/>
          <b>Email:</b> [email]
        </Typography>
      </Box>

      {!readonly ? <Divider flexItem variant="middle" /> : undefined}

      {/* agreement checking */}
      {!readonly ? (
        <Box className="user-agreement-profile-checking-container">
          <Box
            className="user-agreement-profile-checking-content-container"
            onClick={() => setChecked((prev) => !prev)}
          >
            <Checkbox
              className="user-agreement-profile-checkbox"
              color="default"
              checked={checked}
            />
            <Typography className="user-agreement-profile-content">
              By checking the box, you agree to all terms in this full Privacy Policy.
            </Typography>
          </Box>

          <Box className="user-agreement-profile-checking-content-container">
            <TTButton circular variant="outlined" onClick={back}>
              Back
            </TTButton>
            <Typography className="user-agreement-profile-checking-helper"/>
            <TTButton
              className="user-agreement-profile-checkbox-button"
              circular
              disabled={!checked}
              onClick={next}
            >
              Complete!
            </TTButton>
          </Box>
        </Box>
      ) : undefined}
    </Box>
  );
};

export default PrivacyPolicyProfile;
