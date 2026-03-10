import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkSupersub from "remark-supersub";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import clsx from "clsx";
import "./index.scss";

type MarkdownBoxProps = {
  text?: string;
  className?: string;
  disableGap?: boolean;
  isOfficial?: boolean;
};

const MarkdownBox = ({
  text,
  className,
  disableGap = false,
  isOfficial = false,
}: MarkdownBoxProps) => {
  const schema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      span: [...(defaultSchema.attributes?.span || []), ["className"]],
    },
  };

  return (
    <Box
      className={clsx(
        "description-text-field-view-preview",
        disableGap && "disableGap",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkSupersub]}
        rehypePlugins={
          isOfficial
            ? [
                rehypeRaw, // parses raw HTML
                [rehypeSanitize, schema], // sanitize it
              ]
            : []
        }
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
