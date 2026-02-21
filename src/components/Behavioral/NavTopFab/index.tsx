import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Fab } from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import "./index.scss";

type NavTobFabProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const NavTopFab = ({ containerRef }: NavTobFabProps) => {
  // behavior
  const [show, setShow] = useState<boolean>(false);

  const handleNavTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // check whether condition met to show/hide button nav to top
  const handleScroll = () => {
    const isDown = (containerRef.current?.scrollTop ?? 0) >= 100;
    setShow((prev) => (prev !== isDown ? isDown : prev));
  };

  // append onScroll on containerRef and remove it when dismount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return undefined;

  return (
    <Fab className="nav-top-fab" color="utility" onClick={handleNavTop}>
      <ArrowUpwardIcon />
    </Fab>
  );
};

export default NavTopFab;
