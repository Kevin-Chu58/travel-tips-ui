import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setLoading, setUser } from "@redux/userSlice";
import { usersService, type UserBasic } from "@services/users";
import { useAuth0 } from "@auth0/auth0-react";
import { LS_USER_BASIC } from "@constants/localStorage";

export const UserBasicInitializer = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const initUserBasic = async () => {
      if (isLoading) {
        dispatch(setLoading(true));
        return;
      }

      if (!isAuthenticated) {
        dispatch(clearUser());
        return;
      }

      try {
        let userStr = localStorage.getItem(LS_USER_BASIC);
        let user;
        if (userStr) {
          user = JSON.parse(userStr) as UserBasic;
        } else {
          user = await usersService.getUserBasicInfo();
          localStorage.setItem(LS_USER_BASIC, JSON.stringify(user));
        }

        dispatch(
          setUser({
            id: user.id,
            userId: user.userId,
            username: user.username,
            picture: user.picture,
            email: user.email,
            userAgreement: user.userAgreement,
            emailVerified: user.emailVerified,
            isAdmin: user.isAdmin,
            isWriter: user.isWriter,
          }),
        );
      } catch (err) {
        console.error("Failed to load user basic info", err);
        dispatch(clearUser());
      }
    };
    initUserBasic();
  }, [isAuthenticated, isLoading, dispatch]);

  return null;
};
