import { Box, Rating, Typography } from "@mui/material";
import FormBase from "../FormBases/FormBase";
import CheckIcon from "@mui/icons-material/Check";
import { useEffect, useState } from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { BudgetLabels } from "@constants/Types";
import { tripsService } from "@services/trips";
import { enqueueSnackbar } from "notistack";

type BudgetFormProps = {
  open: boolean;
  onClose?: () => void;
  tripId?: number;
  budget?: number;
  onUpdate: (state?: number) => void;
  content?: boolean;
};

const BudgetForm = ({
  open,
  onClose = () => {},
  tripId,
  budget = 0,
  onUpdate,
  content = false,
}: BudgetFormProps) => {
  // budget
  const [_budget, _setBudget] = useState<number>(budget);
  const [hovered, setHovered] = useState<number>(budget);

  useEffect(() => {
    if (open) {
      _setBudget(budget);
      setHovered(budget);
    }
  }, [open]);

  // form handle

  const handleClose = () => {
    onClose();
  };

  // budget handle

  const handleUpdateClick = async () => {
    try {
      if (!tripId) return;

      const newBudget = (await tripsService.patchTripBudgetTag(
        tripId,
        _budget > 0 ? _budget : undefined
      )) as number;

      if (onUpdate) onUpdate(newBudget);

      handleClose();
    } catch (e) {
      if (e instanceof Error) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  if (content) {
    return (
      <Box>
        <Typography fontWeight="bold" color="success">
          {BudgetLabels[hovered > -1 ? hovered : budget]}
        </Typography>
        <Rating
          value={budget}
          precision={1}
          icon={<AttachMoneyIcon color="success" />}
          emptyIcon={<AttachMoneyIcon sx={{ opacity: 0.55 }} />}
          onChange={(_, newValue) => {
            onUpdate(newValue ?? undefined);
          }}
          onChangeActive={(_, newHover) => {
            setHovered(newHover);
          }}
        />
      </Box>
    );
  }

  return (
    <FormBase
      open={open}
      onClose={handleClose}
      title="Choose Budget"
      actionButtonLabel="Update"
      actionButtonStartIcon={<CheckIcon />}
      actionButtonOnClick={handleUpdateClick}
    >
      <Typography fontWeight="bold" color="success">
        {BudgetLabels[hovered > -1 ? hovered : _budget]}
      </Typography>
      <Rating
        value={_budget}
        precision={1}
        icon={<AttachMoneyIcon color="success" />}
        emptyIcon={<AttachMoneyIcon sx={{ opacity: 0.55 }} />}
        onChange={(_, newValue) => {
          _setBudget(newValue ?? 0);
        }}
        onChangeActive={(_, newHover) => {
          setHovered(newHover);
        }}
      />
    </FormBase>
  );
};

export default BudgetForm;
