import { AppBar, Breadcrumbs, Container } from "@mui/material";
import "./index.css";
import Header from "@components/HeaderBar/Header";
import Layouts from "@constants/Layouts";
// import { useNavigate } from "react-router";

type SubHeaderBarProps = {
  items: {
    name: string;
    to: string;
  }[];
  showBack?: boolean;
};

const SubHeaderBar = ({ items, showBack = true }: SubHeaderBarProps) => {
  // const navigate = useNavigate();

  return (
    <AppBar
      key="sub-app-bar"
      className="sub-app-bar"
      position="sticky"
      sx={{
        width: "100vw",
        top: `${Layouts.Header}px`,
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{ display: "flex", alignItems: "center", pb: 0.5, height: Layouts.SubHeader }}
      >
        {showBack && (
          <Header
            key="sub-app-bar-back"
            name="<< back"
            variant="body2"
            to={"/home"}
            // TODO - return to the page with the latest search results
            extraClassName="m0"
            sx={{ pl: 2 }}
          />
        )}
        <Breadcrumbs separator="/" sx={{ ml: { md: 10, lg: 20 } }}>
          {items.map((item) => (
            <Header
              key={`sub-app-bar-${item.name}`}
              name={item.name}
              variant="body2"
              extraClassName="m0"
              to={item.to}
            />
          ))}
        </Breadcrumbs>
      </Container>
    </AppBar>
  );
};

export default SubHeaderBar;
