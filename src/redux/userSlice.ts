import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number | null;
  username: string | null;
  userAgreement: boolean | null;
  isLoading: boolean;
}

const initialState: UserState = {
  id: null,
  username: null,
  userAgreement: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        id: number;
        username: string;
        userAgreement: boolean;
      }>
    ) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.userAgreement = action.payload.userAgreement;
      state.isLoading = false;
    },
    setUserAgreement(state, action: PayloadAction<boolean>) {
      state.userAgreement = action.payload;
    },
    clearUser(state) {
      state.id = null;
      state.username = null;
      state.userAgreement = null;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, setUserAgreement, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
