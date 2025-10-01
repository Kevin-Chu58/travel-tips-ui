import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@redux/userSlice";
import { usersService } from "@services/users";
import { useAuth0 } from "@auth0/auth0-react";

export const UserBasicInitializer = () => {
  const { isAuthenticated } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const initUserBasic = async () => {
      if (isAuthenticated) {
        const user = await usersService.getUserBasicInfo();
        const id = user.id;
        const username = user.username;

        dispatch(setUser({ id, username }));
      }
    };
    initUserBasic();
  }, [isAuthenticated]);

  return null;
};
