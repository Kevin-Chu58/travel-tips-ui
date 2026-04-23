import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setLoading, setUser } from "@redux/userSlice";
import { usersService } from "@services/users";
import { useAuth0 } from "@auth0/auth0-react";
import { LS_USER_BASIC } from "@constants/localStorage";

const THIRTY_MINUTES = 30 * 60 * 1000;

export const UserBasicInitializer = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const dispatch = useDispatch();
  const isFetching = useRef<boolean>(false);

  useEffect(() => {
    // Helper to fetch and sync data
    const refreshUser = async () => {
      if (isFetching.current) return; // Skip if already fetching
      isFetching.current = true;

      try {
        const user = await usersService.getUserBasicInfo();
        // const storageData = { ...user, updatedAt: Date.now() };
        // localStorage.setItem(LS_USER_BASIC, JSON.stringify(storageData));
        dispatch(setUser(user));
      } catch (err) {
        console.error("Failed to refresh user info", err);
      } finally {
        isFetching.current = false;
      }
    };

    const initUserBasic = async () => {
      if (isLoading) return dispatch(setLoading(true));
      if (!isAuthenticated) return dispatch(clearUser());

      try {
        const userStr = localStorage.getItem(LS_USER_BASIC);

        if (userStr) {
          const cached = JSON.parse(userStr);
          const isStale = Date.now() - (cached.updatedAt || 0) > THIRTY_MINUTES;

          // Dispatch cached data immediately for instant UI
          dispatch(setUser(cached));

          // If it's old, refresh it in the background
          if (isStale) refreshUser();
        } else {
          // No cache exists, fetch for the first time
          await refreshUser();
        }
      } catch (err) {
        dispatch(clearUser());
      }
    };

    initUserBasic();

    // BACKGROUND POLLING: Refresh every 30 minutes
    const intervalId = setInterval(() => {
      if (isAuthenticated && !isLoading) {
        refreshUser();
      }
    }, THIRTY_MINUTES);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [isAuthenticated, isLoading, dispatch]);

  return null;
};
