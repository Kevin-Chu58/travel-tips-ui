import UserProfile from "@components/Profile/UserProfile";
import { Container } from "@mui/material";
import type { RootState } from "@redux/store";
import type { UserBasic } from "@services/users";
import { useSelector } from "react-redux";
import "./index.scss";

const Profile = () => {
  // user
  const user = useSelector((state: RootState) => state.user) as UserBasic;
  return (
    <Container
      className="profile-view"
      maxWidth={false}
      disableGutters
    >
      <UserProfile
        user={user}
      />
    </Container>
  );
};

export default Profile;
