import { Container } from "@mui/material";
import TripProfile from "@components/Profile/TripProfile";

/**
 * The view of a specific trip in workshop that allows editing,
 * currently two nav tabs: General and Days
 */
const Trip = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <TripProfile />
    </Container>
  );
};

export default Trip;
