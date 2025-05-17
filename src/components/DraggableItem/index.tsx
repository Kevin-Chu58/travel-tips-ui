import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, ListItem, Paper } from "@mui/material";
import type { ReactNode } from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

type DraggableItemProps = {
  id: number;
  children?: ReactNode;
  highlight?: boolean;
  enableDrag?: boolean;
};

function DraggableItem({
  id,
  highlight = false,
  enableDrag = true,
  children,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const newListeners = enableDrag ? listeners : undefined;

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...newListeners}
      sx={{
        ...style,
        cursor: enableDrag ? "grab" : "auto",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
      elevation={0}
    >
      <ListItem>
        {children}
        {enableDrag && (
          <DragIndicatorIcon
            sx={{ ml: "auto", color: highlight ? "primary.main" : "grey" }}
          />
        )}
      </ListItem>
    </Paper>
  );
}

export default DraggableItem;
