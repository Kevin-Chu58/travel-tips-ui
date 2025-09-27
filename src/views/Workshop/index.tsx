import { Navigate, Route, Routes } from "react-router";
import Trip from "./Trip";
import Main from "./Main";
import Highlight from "./Highlight";
import { useAuth0 } from "@auth0/auth0-react";

const Workshop = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/trip/:tripId" element={<Trip />} />
      <Route path="/trip/:tripId/day/:dayId" element={<Trip />} />
      <Route path="/highlight/:attractionId" element={<Highlight />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Workshop;
