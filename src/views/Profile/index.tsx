import UserProfile from "@components/Profile/UserProfile";
import { Container } from "@mui/material";
import { usersService, type UserProfileBasic } from "@services/users";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import type { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import "./index.scss";

const ProfileView = () => {
  // user
  const user = useSelector((state: RootState) => state.user);
  // user profile
  const [userProfile, setUserProfile] = useState<UserProfileBasic | undefined>(
    undefined,
  );
  // params
  const { auth0Id } = useParams();
  // others
  const navigate = useNavigate();

  useEffect(() => {
    const initProfile = async () => {
      if (!auth0Id) navigate("/profile");

      var userProfile;
      try {
        if (auth0Id) {
          userProfile = await usersService.getUserProfile(auth0Id);
        } else if (user.userId) {
          userProfile = await usersService.getUserProfile(user.userId);
        }
      } catch (e) {
        enqueueSnackbar("Profile does not exist.", { variant: "error" });
        navigate("/");
      }

      setUserProfile(userProfile);
    };

    initProfile();
  }, [auth0Id, user.id]);

  return (
    <Container className="profile-view" maxWidth={false} disableGutters>
      <UserProfile user={userProfile} setUser={setUserProfile} />
    </Container>
  );
};

const Profile = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfileView />} />
      <Route path="/:auth0Id" element={<ProfileView />} />
      <Route path="*" element={<Navigate to="/profile" />} />
    </Routes>
  );
};

export default Profile;
