import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grid, Paper, type SxProps } from "@mui/material";
import type { ReactNode } from "react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

type DraggableItemProps = {
  id: number;
  children?: ReactNode;
  highlight?: boolean;
  enableDrag?: boolean;
  sx?: SxProps;
};

function DraggableItem({
  id,
  highlight = false,
  enableDrag = true,
  children,
  sx,
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
        ...sx,
        cursor: enableDrag ? "grab" : "auto",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
      elevation={0}
    >
      <Grid container size={12}>
        <Grid container size={10}>
          {children}
        </Grid>
        <Grid size={2} display="flex" alignItems="center">
          {enableDrag && (
            <DragIndicatorIcon
              sx={{ ml: "auto", my: "auto", color: highlight ? "primary.main" : "grey" }}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default DraggableItem;
