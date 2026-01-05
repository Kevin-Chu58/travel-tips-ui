import { Box, Chip, Table, Typography } from "@mui/material";
import React, { useState } from "react";
import { RegionUtils } from "@utils/RegionUtils";
import FormBase from "../FormBase";
import RegionForm from "../RegionForm";
import type { Trip } from "@services/trips";
import { useIsMobile } from "@hooks/useIsMobile";
import type { RegionComplete } from "@services/search/regions";
import "./index.scss";

type TagFormProps = {
  trip?: Trip;
  open: boolean;
  onClose: () => void;
  asyncRegion?: (state: RegionComplete) => void;
};

const tagForm = ({
  trip,
  open,
  onClose,
  asyncRegion,
}: TagFormProps) => {
  // window
  const isMobile = useIsMobile();
  // forms
  const [openRegionForm, setOpenRegionForm] = useState<boolean>(false);

  return (
    <React.Fragment>
      <FormBase
        open={open}
        onClose={onClose}
        className="tag-form"
        width="30vw"
        title="Tag Settings"
        subTitle="Click to Edit"
        closeButtonLabel="Close"
        closeButtonVariant="contained"
        panel
      >
        {isMobile ? (
          <Box>
            {/* region tag */}
            <Box onClick={() => setOpenRegionForm(true)}>
              <Typography>Region</Typography>
              <Chip
                color="region"
                label={RegionUtils.getRegionAddress(
                  trip?.region
                )}
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
                    label={RegionUtils.getRegionAddress(
                      trip?.region
                    )}
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
        tripId={trip?.id}
        completeRegion={trip?.region}
        asyncRegion={asyncRegion}
      />
    </React.Fragment>
  );
};

export default tagForm;
