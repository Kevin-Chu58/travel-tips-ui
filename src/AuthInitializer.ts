import { useAuth0 } from "@auth0/auth0-react"
import { setAccessToken } from "@redux/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const AuthInitializer = () => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchToken = async () => {
            if (isAuthenticated) {
                const token = await getAccessTokenSilently();
                dispatch(setAccessToken(token));
            }
        };
        fetchToken();
    }, [isAuthenticated]);

    return null;
}