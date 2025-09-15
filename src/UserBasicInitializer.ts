import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@redux/userSlice";
import { usersService } from "@services/users";
import type { RootState } from "@redux/store";

export const UserBasicInitializer = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const initUserBasic = async () => {
      if (token) {
        const user = await usersService.getUserBasicInfo(token);
        const id = user.id;
        const username = user.username;

        dispatch(setUser({ id, username }));
      }
    };
    initUserBasic();
  }, [token]);

  return null;
};
