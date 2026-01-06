import { Box, Chip, Table, Typography } from "@mui/material";
import React, { useState } from "react";
import { RegionUtils } from "@utils/RegionUtils";
import FormBase from "../FormBase";
import RegionForm from "../RegionForm";
import type { Trip } from "@services/trips";
import { useIsMobile } from "@hooks/useIsMobile";
import { StringUtils } from "@utils/StringUtils";
import BudgetForm from "../BudgetForm";
import "./index.scss";

type TagFormProps = {
  trip?: Trip;
  open: boolean;
  onClose: () => void;
  onUpdateRegion: (state?: number) => void;
  onUpdateBudget: (state?: number) => void;
};

const tagForm = ({
  trip,
  open,
  onClose,
  onUpdateRegion,
  onUpdateBudget,
}: TagFormProps) => {
  // window
  const isMobile = useIsMobile();
  // forms
  const [openRegionForm, setOpenRegionForm] = useState<boolean>(false);
  const [openBudgetForm, setOpenBudgetForm] = useState<boolean>(false);
  const _open = open && !openRegionForm && !openBudgetForm;

  const handleUpdateRegion = (regionId?: number) => {
    onUpdateRegion(regionId);
    setOpenRegionForm(false);
  };

  const handleUpdateBudget = (budget?: number) => {
    onUpdateBudget(budget);
    setOpenBudgetForm(false);
  };

  return (
    <React.Fragment>
      <FormBase
        open={_open}
        onClose={onClose}
        className="tag-form"
        title="Tag Settings"
        subTitle="Click to Edit"
        closeButtonLabel="Close"
        closeButtonVariant="contained"
        panel
      >
        {isMobile ? (
          <Box className="container">
            {/* region tag */}
            <Box onClick={() => setOpenRegionForm(true)}>
              <Typography>Region</Typography>
              <Chip
                color="region"
                size="small"
                label={RegionUtils.getRegionAddress(trip?.region)}
              />
            </Box>
            {/* budget tag */}
            <Box onClick={() => setOpenBudgetForm(true)}>
              <Typography>Budget</Typography>
              <Chip
                color="success"
                size="small"
                label={StringUtils.getBudgetStr(trip?.budget)}
              />
            </Box>
          </Box>
        ) : (
          <Table className="table">
            <tbody>
              <tr onClick={() => setOpenRegionForm(true)}>
                <th className="type">Region</th>
                <th>
                  <Chip
                    color="region"
                    label={RegionUtils.getRegionAddress(trip?.region)}
                  />
                </th>
              </tr>
              <tr onClick={() => setOpenBudgetForm(true)}>
                <th className="type">Budget</th>
                <th>
                  <Chip
                    color="success"
                    variant="filled"
                    label={StringUtils.getBudgetStr(trip?.budget)}
                  />
                </th>
              </tr>
            </tbody>
          </Table>
        )}
      </FormBase>

      {/* forms */}
      <RegionForm
        open={openRegionForm}
        onClose={() => setOpenRegionForm(false)}
        completeRegion={trip?.region}
        onUpdate={handleUpdateRegion}
      />

      <BudgetForm
        open={openBudgetForm}
        onClose={() => setOpenBudgetForm(false)}
        tripId={trip?.id}
        budget={trip?.budget}
        onUpdate={handleUpdateBudget}
      />
    </React.Fragment>
  );
};

export default tagForm;
