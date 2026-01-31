import { Box, Container } from "@mui/material";
import GospelContent from "./GospelContent";
import { Navigate, Route, Routes } from "react-router";
import GospelDrawer from "./GospelDrawer";
import { useParams } from "react-router";
import { useState } from "react";
import "./index.scss";

const Gospel = () => {
  // url
  const { orderId } = useParams();
  // behavior
  const [isHidden, setIsHidden] = useState<boolean>(false); // hide drawer

  if (orderId && !/^\d+$/.test(orderId)) {
    return <Navigate to="." replace />;
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Box className="gospel-view-container">
        <GospelDrawer isHidden={isHidden} setIsHidden={setIsHidden} />
        <GospelContent setIsHidden={setIsHidden} />
      </Box>
    </Container>
  );
};

const GospelView = () => {
  return (
    <Routes>
      <Route key="main" index element={<Gospel />} />
      <Route key="topic" path=":labelSlug" element={<Gospel />} />
      <Route key="sermon" path=":labelSlug/:orderId" element={<Gospel />} />
      <Route path="*" element={<Navigate to="/gospel" replace />} />
    </Routes>
  );
};

export default GospelView;
