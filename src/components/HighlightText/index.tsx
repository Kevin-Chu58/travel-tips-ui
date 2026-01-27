export const highlightText = (
  text: string,
  query: string,
  Highlight: React.FC<{ children: React.ReactNode }>
) => {
  if (!query) return text;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");

  return text.split(regex).flatMap((part, index, arr) => {
    if (index === arr.length - 1) return [part];

    const match = text.match(regex)?.[0];
    return [
      part,
      <Highlight key={index}>{match}</Highlight>,
    ];
  });
};