import type { UserSimple } from "@services/users";
import { useNavigate } from "react-router";

export const useNavToProfile = (user?: UserSimple) => {
  const navigate = useNavigate();

  const navToProfile = () => {
    if (!user) return;

    navigate(`/profile/${user.userId}`);
  };

  return navToProfile;
};
