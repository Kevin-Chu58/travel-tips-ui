import { Route, Routes } from "react-router";
import Trip from "./Trip";
import Main from "./Main";

const Workshop = () => {

  return (
    <>
      <Routes>
        <Route index key="workshop-main" element={<Main />} />
        <Route
          key="workshop-trip-edit"
          path="/trip/:tripId/*"
          element={<Trip />}
        />
      </Routes>
    </>
  );
};

export default Workshop;
