import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import type { Highlight } from "@services/highlights";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

type HighlightItemProps = {
  highlight: Highlight;
  isLast?: boolean;
};

const HighlightItem = ({ highlight, isLast = false }: HighlightItemProps) => {
  return (
    <React.Fragment>
      <Box display="flex" flexDirection="row" gap={2} py={1}>
        <Avatar alt={highlight.createdBy?.toString()} src={""} />

        <Box>
          {/* user name */}
          <Typography fontSize=".9rem" color="dimgrey">
            {highlight.createdBy}
          </Typography>
          {/* description */}
          <Typography whiteSpace="pre-wrap">{highlight.description}</Typography>
          {/* option */}
          <Box display="flex" justifyContent="right">
            <IconButton size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {!isLast && <Divider flexItem />}
    </React.Fragment>
  );
};

export default HighlightItem;
