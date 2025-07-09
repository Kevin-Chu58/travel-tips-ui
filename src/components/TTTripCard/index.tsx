import { Box, Tooltip, Typography } from "@mui/material";
import { tripsService, type Trip } from "@services/trips";
import TimeUtils from "@utils/TimeUtils";
import { useNavigate } from "react-router";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector } from "react-redux";
import type { RootState } from "@redux/store";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Memorial from "@assets/Lincoln_Memorial.jpeg";
import TTIconButton from "@components/TTIconButton";
import EditIcon from '@mui/icons-material/Edit';

type TTTripCardProps = {
  trip: Trip;
  isFocused?: boolean;
  setIsFocused?: (state: number) => void;
  setParentUpdate?: () => void;
};

const TTTripCard = ({
  trip,
  isFocused,
  setIsFocused,
  setParentUpdate,
}: TTTripCardProps) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();

  const updateTripIsPublic = async (id: number) => {
    if (token) {
      await tripsService.patchTripIsPublic([id], !trip.isPublic, token);
      if (setParentUpdate) setParentUpdate();
    }
  };

  return (
    <Box
      key={`my-trip-${trip.id}`}
      onClick={() => (setIsFocused ? setIsFocused(trip.id) : {})}
      sx={{
        overflow: "hidden",
        position: "relative",
        width: 190,
        height: 320,
        cursor: "pointer",
      }}
    >
      <Box p={.5} height={300} position="relative" sx={{
        overflow: "hidden",
        border: "1px solid transparent",
        ":hover": {
          borderColor: "darkgray",
          borderRadius: 2,
        }
      }}>
        {/* images */}
        <Box
          component="img"
          src={Memorial}
          sx={{
            width: "100%",
            height: 160,
            objectFit: "cover",
            objectPosition: "50% 40%",
            borderRadius: 2,
          }}
        />

        {/* name */}
        <Tooltip title={trip.name} placement="bottom-start">
            <Typography
            textTransform="capitalize"
            display="flex"
            alignItems="center"
            fontSize={18}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {trip.name}
          </Typography>
        </Tooltip>

        {/* days */}
        <Typography
          fontSize={14}
          sx={{
            mt: -0.5,
            color: "dimgrey",
            fontStyle: trip.numDays ? "none" : "italic",
          }}
        >
          {TimeUtils.formatDays(trip.numDays ?? 0)}
        </Typography>

        {/* button group */}
        <Box position="absolute" right={0} bottom={0}>
          <TTIconButton sx={{color: "primary.main", borderColor: "primary.main"}} onClick={(e) => {
              e.stopPropagation();
              updateTripIsPublic(trip.id);
            }}>
            {trip.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </TTIconButton>
          <TTIconButton onClick={(e) => {
              e.stopPropagation();
              navigate(`/workshop/trip/${trip.id}`);
            }}>
            <EditIcon />
          </TTIconButton>
        </Box>
      </Box>      

      {/* focused status */}
      {isFocused && (
        <Box
          position="absolute"
          top={0}
          right={0}
          width={40}
          height={40}
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={10}
          sx={{
            background: "rgba(0, 0, 0, .8)",
            borderRadius: 2,
          }}
        >
          <CheckCircleIcon fontSize="large" sx={{ color: "success.light" }} />
        </Box>
      )}
    </Box>
  );
};

export default TTTripCard;
