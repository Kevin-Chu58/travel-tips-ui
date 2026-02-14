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
  const { userId } = useParams();
  // others
  const navigate = useNavigate();

  useEffect(() => {
    const initProfile = async () => {
      const id = userId ? parseInt(userId) : undefined;
      if (id === 0) navigate("/profile"); // doesn't work until implement routes

      var userProfile;
      try {
        if (id) {
          userProfile = await usersService.getUserProfile(id);
        } else if (user.id) {
          userProfile = await usersService.getUserProfile(user.id);
        }
      } catch (e) {
        enqueueSnackbar("Profile does not exist.", { variant: "error" });
        navigate("/profile");
      }

      setUserProfile(userProfile);
    };

    initProfile();
  }, [userId, user.id]);

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
      <Route path="/:userId" element={<ProfileView />} />
      <Route path="*" element={<Navigate to="/profile" />} />
    </Routes>
  );
};

export default Profile;
