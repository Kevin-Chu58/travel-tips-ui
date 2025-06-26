import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    accessToken: string | null,
    isLoading: boolean,
};

const initialState: AuthState = {
    accessToken: null,
    isLoading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
            state.isLoading = false;
        },
        clearAccessToken(state) {
            state.accessToken = null;
            state.isLoading = false;
        }
    }
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;