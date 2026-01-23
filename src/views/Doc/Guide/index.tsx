import { Box, Container } from "@mui/material";
import MarkdownBox from "@components/MarkdownBox";
import "./index.scss";
import TTButton from "@components/TTButton";
import { useNavigate } from "react-router";

const Guide = () => {
  const navigate = useNavigate();

  const navigateToDemo = () => navigate("/trip/1");

  const guide_purpose = `
  ## Purpose

  This guide provides a quick overview of how to use **TravelTips** — from creating trips, adding events, and navigating between different views, to styling your text with basic Markdown. Each section includes short steps and examples so you can understand the workflow easily and follow along without confusion.
  `;

  const guide_create_new_trip = `
  ## Guide: How to Create a Trip

  1. Go to **Workshop**.
  2. Click **Trips** tab if you are not there already.
  3. Click button **\`+ New Trip\`**.
  4. Give your new trip a name to create one.
  5. New trip will appear in **Trips** when it is created.
  `;

  const guide_add_events = `
  ## Guide: How to Add Events

  1. Click \`+\` icon at the end of the tab.
  2. Click it and the tab auto-navigates to the newly created day.
  3. There are two views: **Event** and **Calendar**, to create events:
    - click \`+\` fab in both view.
    - **drag and drop** on the 15min interval only in **Calendar** view.
  4. Fill out the form to create a new event.
  `;

  const guide_markdown = `
  ## Guide: How to Add Stylings in Textfield

  **Bold** - use \`**\` to wrap around the text
  _italic_ - use \`_\` to wrap around the text
  ~strikethrough~ - use \`~\` to wrap around the text
  \`code block\` - use \` to wrap around the text\n
  header - use \`#\` with a space at the start of the line (\`#\` is h1, more \`#\` means smaller header)
  unordered list - use \`-\` with a space at the start of the line
  ordered list - use \`1.\` with a space at the start of the line 
  \`[text](url)\` - links
  \`![text](url)\` - images (url must ends with a valid image format e.g. \`.png\`)
  `;

  return (
    <Container className="guide-container" maxWidth={false} disableGutters>
      <Box className="container-box">
        <Box className="markdown-container">
          <MarkdownBox text={guide_purpose} />
          <Box className="center-container">
            <b>Checkout my demo here! 🔻🔻🔻</b>
          </Box>
          <Box className="center-container">
            <TTButton
              size="large"
              label="⭐My Demo⭐"
              color="primary"
              onClick={navigateToDemo}
            />
          </Box>
          <MarkdownBox text={guide_create_new_trip} />
          <Box className="iframe-container">
            <iframe
              src="https://drive.google.com/file/d/1WrV7RRPEhV9w_5a4aFtL7bykyKhkJKzi/preview"
              width="320"
              height="180"
              allow="autoplay"
              allowFullScreen
            />
          </Box>
          <MarkdownBox text={guide_add_events} />
          <Box className="iframe-container">
            <iframe
              src="https://drive.google.com/file/d/1Pm-g-qT7Ez9YF6_AEb6lZMYw6YHOp1-U/preview"
              width="320"
              height="180"
              allow="autoplay"
              allowFullScreen
            />
          </Box>
          <MarkdownBox text={guide_markdown} />
        </Box>
      </Box>
    </Container>
  );
};

export default Guide;
