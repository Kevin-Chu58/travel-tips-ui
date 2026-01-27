import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setLoading, setUser } from "@redux/userSlice";
import { usersService } from "@services/users";
import { useAuth0 } from "@auth0/auth0-react";

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
        const user = await usersService.getUserBasicInfo();

        dispatch(
          setUser({
            id: user.id,
            userId: user.userId,
            username: user.username,
            userAgreement: user.userAgreement,
            isAdmin: user.isAdmin,
            isWriter: user.isWriter,
          })
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
