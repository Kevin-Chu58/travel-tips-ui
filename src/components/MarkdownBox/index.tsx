import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import clsx from "clsx";
import "./index.scss";

type MarkdownBoxProps = {
  text?: string;
  disableGap?: boolean;
};

const MarkdownBox = ({ text, disableGap = false }: MarkdownBoxProps) => {
  return (
    <Box
      className={clsx(
        "description-text-field-view-preview",
        disableGap && "disableGap"
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          img: ({ node, ...props }) => <img {...props} loading="lazy" />,
        }}
      >
        {text || "*Nothing to preview*"}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownBox;
