import { Navigate, Route, Routes } from "react-router";
import { Container } from "@mui/material";
import { useParams } from "react-router";
import TripProfile from "@components/Profile/TripProfile";

const TripView = () => {
  // url
  const { tripId } = useParams();

  if (!/^\d+$/.test(tripId ?? "")) {
    return <Navigate to="/home" />;
  }

  return (
    <Container className="trip-page-container" maxWidth={false} disableGutters>
      <TripProfile readonly />
    </Container>
  );
};

const Trip = () => {
  return (
    <Routes>
      <Route path=":tripId" element={<TripView />} />
      <Route path=":tripId/day/:dayId" element={<TripView />} />
      <Route path=":tripId/pdf-overview" element={<TripView />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default Trip;
