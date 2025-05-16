import SubHeaderBar from "@components/SubHeaderBar";
import { Route, Routes } from "react-router";
import Trips from "./Trips";
import Trip from "./Trip";

const Workshop = () => {

    let headerItems = [{
    name: "Trips",
    to: `/workshop`,
  }, 
  // {
  //   name: "Routes",
  //   to: `/workshop/${routeId}`,
  // }
];

    return (
        <>
        <SubHeaderBar items={headerItems} showBack={false} />
        <Routes>
            <Route index key="workshop-trip" element={<Trips />}/>
            <Route key="workshop-trip-edit" path="/trip/:tripId/*" element={<Trip />}/>
        </Routes>
        </>
    )
};

export default Workshop;