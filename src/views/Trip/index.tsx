import { Navigate, Route, Routes } from "react-router";
import { Container } from "@mui/material";
import { useParams } from "react-router";
import { Headers } from "@constants/Layouts";
import TripProfile from "@components/Profile/TripProfile";

const TripView = () => {
  // url
  const { tripId } = useParams();

  if (!/^\d+$/.test(tripId ?? "")) {
    return <Navigate to="/home" />;
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        color: "black",
        overflowX: "hidden",
        overflowY: "auto",
        height: `calc(100vh - ${Headers}px)`,
      }}
    >
      <TripProfile readonly />
    </Container>
  );
};

const Trip = () => {
  return (
    <Routes>
      <Route path=":tripId" element={<TripView />} />
      <Route path=":tripId/day/:dayId" element={<TripView />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default Trip;
