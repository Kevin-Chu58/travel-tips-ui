import { Alert, Box, Checkbox, Typography } from "@mui/material";
import UserAgreementBase from "../UserAgreementBase";
import { BehaviorUtils } from "@utils/BehaviorUtils";
import React, { useState } from "react";
import clsx from "clsx";

type TermsOfServiceProfileProps = {
  readonly?: boolean;
  isGuest?: boolean;
  next?: () => void;
  back?: () => void;
};

const TermsOfServiceProfile = ({
  readonly = false,
  isGuest = false,
  next,
  back,
}: TermsOfServiceProfileProps) => {
  // checkbox
  const [checked, setChecked] = useState<boolean>(false);
  const [checkedSection7, setCheckedSection7] = useState<boolean>(false);
  const [checkedGuest, setCheckedGuest] = useState<boolean>(false);

  const handleCheckboxSection7OnClick = () => {
    if (checked) setChecked(false);
    setCheckedSection7((prev) => !prev);
  };

  // scrolling

  const scrollToSection7 = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    BehaviorUtils.scrollToElementById("section-7");
  };

  const guestSection = (
    <Typography component="div" className="content">
      Guests are individuals who do <b>not</b> create an account.
      <br />
      Guests may:
      <ul>
        <li>Freely search the app</li>
        <li>View publicly available travel content (“Trips”)</li>
        <li>Use attraction lookup features (“Attractions”)</li>
      </ul>
      Guests <b>are NOT bound by the User Agreement</b>, except for these
      general rules:
      <ul>
        <li>
          Do not use the app illegally (e.g. hacking, scraping, attacking
          servers)
        </li>
        <li>Do not copy or illegally redistribute copyrighted material</li>
        <li>Do not attempt to impersonate Users or gain unauthorized access</li>
      </ul>
      Guests do <b>not</b> receive content posting privileges.
    </Typography>
  );

  if (isGuest)
    return (
      <UserAgreementBase
        showCross={false}
        subHeader="Guest Terms of Service"
        checkingChildren={
          <Box
            className="checking-content-container"
            onClick={() => setCheckedGuest((prev) => !prev)}
          >
            <Checkbox
              className="checkbox"
              color="default"
              checked={checkedGuest}
            />
            <Typography className="content">
              By checking the box, you agree to all terms in this guest User
              Agreement.
            </Typography>
          </Box>
        }
        readonly={readonly}
        nextLabel="Complete!"
        nextDisabled={!checkedGuest}
        next={next}
      >
        {guestSection}
      </UserAgreementBase>
    );

  return (
    <UserAgreementBase
      subHeader="Terms of Service"
      checkingChildren={
        <React.Fragment>
          <Box
            className="checking-content-container"
            onClick={handleCheckboxSection7OnClick}
          >
            <Checkbox
              className="checkbox"
              color="default"
              checked={checkedSection7}
            />
            <Typography className="content">
              By checking the box, you agree to how TravelTips manage User
              Content in{" "}
              <span className="link" onClick={scrollToSection7}>
                Section 7
              </span>
              .
            </Typography>
          </Box>
          <Box
            className="checking-content-container"
            onClick={() =>
              checkedSection7 ? setChecked((prev) => !prev) : undefined
            }
          >
            <Checkbox
              className="checkbox"
              color="default"
              disabled={!checkedSection7}
              checked={checked}
            />
            <Typography
              className={clsx("content", !checkedSection7 && "disabled")}
            >
              By checking the box, you agree to all terms in this full
              Agreement.
            </Typography>
          </Box>
        </React.Fragment>
      }
      readonly={readonly}
      backLabel="Back"
      nextHelperNote="Privacy Policy"
      nextDisabled={!checked || !checkedSection7}
      back={back}
      next={next}
    >
      <React.Fragment>
        {/* section 1 */}
        <Typography variant="h6">1. Scope of This Agreement</Typography>
        <Typography className="content">
          This User Agreement (“Agreement”) applies{" "}
          <b>only to individuals who create a TravelTips account</b> (“Users”).{" "}
          <br />
          By registering for an account, posting content, or accessing user-only
          features, you agree to this Agreement.
          <br />
          <br />
          <b>Guests</b> (people who do not create an account) may browse,
          search, share and view publicly available content without being bound
          by this Agreement.
          <b>
            However, guests must still comply with basic acceptable use rules
            described in Section 2.2.
          </b>
        </Typography>

        {/* section 2 */}
        <Typography variant="h6">2. Access Types</Typography>
        <Typography variant="subtitle1">
          2.1 Registered Users (“Users”)
        </Typography>
        <Typography component="div" className="content">
          Users may:
          <ul>
            <li>
              Post travel itineraries or attraction reviews (“Highlights”).
            </li>
            <li>Save places, bookmark attractions, etc.</li>
            <li>
              And any other features requiring login, except paid services that
              require subscription or one-time purchase.
            </li>
          </ul>
        </Typography>
        <Typography variant="subtitle1">2.2 Guests</Typography>
        {guestSection}
        <Typography variant="subtitle1">
          2.3 When a Guest Becomes a User
        </Typography>
        <Typography component="div" className="content">
          A guest becomes a User the moment they:
          <ul>
            <li>Create an account, or</li>
            <li>Attempt to post/upload any content</li>
          </ul>
          At that point, acceptance of this Agreement is required.
        </Typography>

        {/* section 3 */}
        <Typography variant="h6">3. Acceptance of Terms</Typography>
        <Typography className="content">
          By accessing or using the TravelTips app (“the App”), you agree to be
          bound by this User Agreement and all applicable laws. If you do not
          agree, you may not use the App.
        </Typography>

        {/* section 4 */}
        <Typography variant="h6">4. Description of Service</Typography>
        <Typography className="content">
          TravelTips provides travel-related content, including recommendations,
          user-created trip plans, attraction information, and interactive tools
          to assist with travel planning.
          <br />
          <br />
          Features may change or update over time.
        </Typography>

        {/* section 5 */}
        <Typography variant="h6">5. Eligibility</Typography>
        <Typography className="content">
          You must be at least 13 years old to use the App.
          <br />
          If you are under the age of majority in your jurisdiction, you must
          have permission from a pranet or legal guardian.
        </Typography>

        {/* section 6 */}
        <Typography variant="h6">6. User Accounts</Typography>
        <Typography component="div" className="content">
          <ul>
            <li>
              You are responsible for maintaining the confidentiality of your
              login credentials.
            </li>
            <li>
              You are responsible for all activity that occurs under your
              account.
            </li>
            <li>
              TravelTips may suspend or terminate accounts for violations of
              these Terms.
            </li>
          </ul>
        </Typography>

        {/* section 7 */}
        <Typography id="section-7" variant="h6">
          7. User Content
        </Typography>
        <Typography className="content">
          “User Content” includes any text, images, reviews, travel tips, or
          other materials submitted by users.
        </Typography>
        <Typography variant="subtitle1">7.1 License Grant</Typography>
        <Typography className="content">
          By submitting User Content, you grant TravelTips a non-exclusive,
          worldwide, royalty-free license to use, display, modify, distribute,
          and share the content as part of operating the App.
        </Typography>
        <Typography variant="subtitle1">
          7.2 Public vs. Private Content
        </Typography>
        <Typography className="content">
          <b>Public Content</b> refers to User Content that is publicly visible
          or discoverable within the App. <b>Private Content</b> refers to User
          Content that is not publicly visible or searchable, including private
          trips and content shared only with selected users.
          <br />
          <br />
          TravelTips does{" "}
          <b>not proactively monitor or moderate Private Content</b>.
          <br />
          <br />
          <b>
            However, Private Content that is shared with other users may be
            reviewed and moderated if it is reported by a user, required by law,
            or reasonably suspected to violate this Agreement or applicable law.
            <br />
            <br />
            User Content that is exported, generated, or distributed in another
            format (including PDF files) remains subject to this Agreement and
            may be reviewed and moderated under the same standards, regardless
            of the format in which it is presented or shared.
          </b>
        </Typography>
        <Typography variant="subtitle1">7.3 Content Standards</Typography>
        <Typography component="div" className="content">
          All your submitted content must be consistent with the Christian
          foundations and mission of TravelTips. Therefore, you agree that your
          content:
          <ul>
            <li>
              Does not promote ideas, practices, lifestyles, or teachings that
              contradict the moral and ethical standards of the Bible as
              understood by the Christian faith community operating TravelTips;
            </li>
            <li>
              Does not advocate, celebrate, or encourage sexual behavior,
              identity expressions, or moral positions that are inconsistent
              with the Biblical understanding of marriage, sexuality, and
              gender;
            </li>
            <li>
              Does not promote or encourage conduct identified as sinful in
              Scripture;
            </li>
            <li>
              May include travel information about locations connected to other
              religions (such as temples, shrines, or cultural heritage sites),
              provided such content is informational in nature and does not
              endorse or encourage the worship of other deities, idols, or
              spiritual practices contrary to Biblical teaching;
            </li>
            <li>
              Does not promote occult practices, witchcraft, sorcery,
              fortune-telling, astrology, or any spiritual activity outside the
              Christian worldview;
            </li>
            <li>
              Does not contain hate speech, profanity, explicit or pornographic
              material, harassment, spam, or scams;
            </li>
            <li>
              Does not violate any laws or infringe on intellectual property or
              privacy rights.
            </li>
          </ul>
          For clarity, <b>informational, descriptive, or neutral references</b>{" "}
          are permitted; the following examples apply only to User Content that{" "}
          <b>promotes, endorses, encourages, or advocates</b> the listed ideas
          or practices.
        </Typography>
        <Alert severity="success">
          <b>The following examples do NOT violate this term:</b>
          <ul>
            <li>Travel photos</li>
            <li>Reviews of locations, restaurants, hotels.</li>
            <li>
              Information about Buddhist temples, Hindu shrines, etc,{" "}
              <b>as long as it does NOT promote worship</b>, only explains
              history, architecture, or travel details.
            </li>
            <li>
              Cultural notes (e.g. “This temple is popular with tourists”).
            </li>
          </ul>
        </Alert>
        <Alert severity="error">
          <b>The following examples violate this term:</b>
          <ul>
            <li>
              <b>Promotes LGBTQ+ ideology</b> (e.g. celebrating same-sex
              relationships, gender identity expressions outside male/female).
            </li>
            <li>
              <b>Promotes sexual content</b> (explicit images, sexual
              discussions, hookup recommendations).
            </li>
            <li>
              <b>Promotes non-Biblical gender ideology</b> (e.g. transgender
              advocacy, pronoun ideology).
            </li>
            <li>
              <b>Promotes extra-marital or non-Biblical relationships</b>{" "}
              (cohabitation advocacy, adultery approval).
            </li>
            <li>
              <b>Promotes “woke” ideologies</b> (DEI activism, critical gender
              theory, critical race theory, etc.)
            </li>
            <li>
              <b>
                Promotes or advocates for abortion as morally acceptable or
                encouraged
              </b>{" "}
              (e.g. pro-abortion activism, endorsements, or messaging
              inconsistent with a Biblical pro-life view).
            </li>
            <li>
              <b>Encourages or endorses other religions' worship practices</b>{" "}
              (e.g. “pray to this deity”, “offer incense to Buddha”).
            </li>
            <li>
              <b>Promotes occult or spiritual practices</b> (witchcraft, tarot,
              astrology, magic rituals, divination).
            </li>
            <li>
              <b>Promotes idolatry</b> (encouraging prayer, devotion, or
              offerings to any non-Christian deity, including wishing well).
            </li>
            <li>
              <b>
                Promoting demonstrably false, misleading, or inconsistent with
                the platform's editorial standards for truth and civil discourse
                claims is prohibited. This includes narratives we determine to
                be factually unsupported.
              </b>{" "}
              (e.g. interpretations of the George Floyd incident that deny his
              resistance to lawful custody or assert racial animus by police
              without verifiable evidence).
            </li>
            <li>
              <b>Contains profanity or hateful language.</b>
            </li>
            <li>
              <b>Contains pornographic, nude, or overly suggestive imagery.</b>
            </li>
            <li>
              <b>Contains illegal activity</b> (drugs, crime instructions,
              pirated content).
            </li>
            <li>
              <b>Violates intellectual property</b> (copied photos, stolen
              text).
            </li>
            <li>
              <b>Contains spam or scams</b> (malicious links, commercial
              solicitation).
            </li>
          </ul>
        </Alert>
        <Alert severity="info">
          TravelTips reserves the right, but not the obligation, to remove,
          restrict, or disable access to any User Content that violates this
          Agreement, is reported by users, or is required to be removed by law.
          Furthermore, TravelTips may, in its <b>sole discretion</b>, moderate
          or remove any content determined to be inconsistent with the
          <b>Christian spirit and mission</b> of the platform, or that it deems
          to be <b>socially disruptive or factually deceptive</b> in a manner
          that undermines the peaceful and truth-seeking environment of the
          community. TravelTips moderates content as a “Good Samaritan” under 47
          U.S.C. § 203(c)(2) to restrict material that it finds religiously or
          morally objectionable.
        </Alert>

        <Typography variant="subtitle1">
          7.4 Moral Integrity & User Accountability
        </Typography>
        <Typography component="div" className="content">
          TravelTips is a community built on the Lordship of Christ and Biblical
          holiness. While we do not police the private lives of all users, we
          reserve the right to suspend or terminate the account of any user
          whose public conduct, known reputation, or external advocacy is found
          to be flagrantly inconsistent with the Biblical moral standards of
          this platform. This includes, but is not limited to:
          <ul>
            <li>
              <b>Public Advocacy:</b> Publicly promoting or leading
              organizations that advance "woke" ideologies, abortion access, or
              LGBTQ+ agendas.
            </li>
            <li>
              <b>Scandalous Conduct:</b> Engaging in public behavior that is
              demonstrably sinful, illegal, or morally deceptive as understood
              by the Christian community operating this platform.
            </li>
            <li>
              <b>Platform Integrity:</b> We believe that the presence of certain
              public figures or activists may undermine the spiritual
              environment we seek to provide. Therefore, TravelTips reserves the{" "}
              <b>sole and absolute discretion</b> to deny service to individuals
              whose public identity serves as an endorsement of values contrary
              to the Word of God.
            </li>
          </ul>
        </Typography>

        {/* section 8 */}
        <Typography variant="h6">8. Prohibited Conduct</Typography>
        <Typography component="div" className="content">
          Users must not:
          <ul>
            <li>Use the App for illegal or fraudulent activities.</li>
            <li>Upload harmful content such as malware or deceptive links.</li>
            <li>Scrap, copy, or reverse-engineer the App.</li>
            <li>
              Interfere with the App's operation or bypass security measures.
            </li>
            <li>Misrepresent information or impersonate others.</li>
            <li>
              Post content that is violent, hateful, harassing, or
              discriminatory.
            </li>
          </ul>
        </Typography>

        {/* section 9 */}
        <Typography variant="h6">9. Third-Party Services</Typography>
        <Typography component="div" className="content">
          TravelTips may link to third-party websites, map providers, booking
          services, or external APIs.
          <br />
          <br />
          We are not responsible for:
          <ul>
            <li>The accuracy of third-party data</li>
            <li>Actions of third-party companies</li>
            <li>Any loss or damage caused by third-party services</li>
          </ul>
          Your use of third-party services is subject to their own terms and
          policies.
        </Typography>

        {/* section 10 */}
        <Typography variant="h6">10. Intellectual Property</Typography>
        <Typography className="content">
          All content, trademarks, branding, code and materials in the App
          (excluding User Content) are the property of TravelTips or its
          licensors.
          <br />
          <br />
          You may not copy, modify, distribute, or create derivative works
          unless explicitly allowed.
        </Typography>

        {/* section 11 */}
        <Typography variant="h6">11. Disclaimers</Typography>
        <Typography component="div" className="content">
          TravelTips provides content <b>“as is” without warranties</b> of any
          kind.
          <br />
          <br />
          We do not guarantee:
          <ul>
            <li>Accuracy of travel information</li>
            <li>Availability of attractions</li>
            <li>Safety of any location or activity</li>
            <li>Uninterrupted functionality of the App</li>
          </ul>
          TravelTips does not provide professional travel, legal, or safety
          advice. Users assume all risks when traveling or relying on content
          within the App.
        </Typography>

        {/* section 12 */}
        <Typography variant="h6">12. Limitation of Liability</Typography>
        <Typography component="div" className="content">
          To the fullest extent permitted by law:
          <ul>
            <li>
              TravelTips is not liable for any damages, including travel losses,
              missed bookings, personal injury, lost profits, or data loss,
              resulting from use of the App
            </li>
          </ul>
        </Typography>

        {/* section 13 */}
        <Typography variant="h6">13. Privacy</Typography>
        <Typography className="content">
          Your use of the App is also governed by our <b>Privacy Policy</b>.
        </Typography>

        {/* section 14 */}
        <Typography variant="h6">14. Termination</Typography>
        <Typography component="div" className="content">
          We may suspend or terminate your access for:
          <ul>
            <li>Violating these Terms</li>
            <li>Illegal activity</li>
            <li>Any reason at our discretion</li>
          </ul>
          Upon termination, your license to use the App ends immediately.
        </Typography>

        {/* section 15 */}
        <Typography variant="h6">15. Changes to the Terms</Typography>
        <Typography className="content">
          We may update these Terms at any time.
          <br />
          <br />
          If changes are substantial, we will notify you (e.g. via email, in-app
          message). Continued use of the App after changes means you accept the
          updated Terms.
        </Typography>

        {/* section 16 */}
        <Typography variant="h6">16. Governing Law and Jurisdiction</Typography>
        <Typography className="content">
          These Terms and your use of TravelTips shall be governed by and
          construed in accordance with the laws of the{" "}
          <b>State of Washington</b>, without regard to its conflict of law
          principles. You agree that the{" "}
          <b>
            United States District Court for the Western District of Washington
          </b>
          (Tacoma Division) or the state courts located in{" "}
          <b>Lewis County, Washington</b> shall have exclusive jurisdiction over
          any case not subject to arbitration as defined in Section 16.1.
        </Typography>
        <Typography variant="subtitle1">16.1 Mandatory Arbitration</Typography>
        <Typography className="content">
          Any dispute arising from this Agreement shall be settled by binding
          arbitration administered by the{" "}
          <b>American Arbitration Association</b> in accordance with its
          Consumer Arbitration Rules. The arbitration shall take place in{" "}
          <b>Lewis County, Washington</b>.
        </Typography>
        <Typography variant="subtitle1">
          16.2 Waiver of Jury Trial and Class Action
        </Typography>
        <Typography className="content">
          By agreeing to these Terms, you and TravelTips both{" "}
          <b>waive the right to a trial by jury</b> or to participate in a class
          action lawsuit. You agree that any dispute resolution proceedings will
          be conducted only on an individual basis and not in a class
          consolidated or representative action.
        </Typography>

        {/* section 17 */}
        <Typography variant="h6">17. Severability</Typography>
        <Typography className="content">
          If any provision of these Terms is held by a court or arbitrator of
          competent jurisdiction to be invalid, illegal, or unenforceable for
          any reason, such provision shall be eliminated or limited to the
          minimum extent necessary so that the remaining provisions of the Terms
          will continue in full force and effect. It is the express intent of
          the parties that the remaining provisions shall be construed and
          enforced to the greatest extent permitted by law, preserving the
          original religious mission and moral standards of TravelTips.
        </Typography>

        {/* section 18 */}
        <Typography variant="h6">18. Contact Us</Typography>
        <Typography className="content">
          If you have questions about these Terms, contact us at: [email]
        </Typography>
      </React.Fragment>
    </UserAgreementBase>
  );
};

export default TermsOfServiceProfile;
