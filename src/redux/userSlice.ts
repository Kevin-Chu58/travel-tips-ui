import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number | null;
  userId: string | null;
  username: string | null;
  userAgreement: boolean | null;
  isAdmin: boolean | null;
  isWriter: boolean | null;
  isLoading: boolean;
}

const initialState: UserState = {
  id: null,
  userId: null,
  username: null,
  userAgreement: null,
  isAdmin: null,
  isWriter: null,
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
        userId: string;
        username: string;
        userAgreement: boolean;
        isAdmin?: boolean;
        isWriter?: boolean;
      }>
    ) {
      state.id = action.payload.id;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.userAgreement = action.payload.userAgreement;

      if (action.payload.isAdmin) state.isAdmin = action.payload.isAdmin;
      if (action.payload.isWriter) state.isWriter = action.payload.isWriter;
      state.isLoading = false;
    },
    setUserAgreement(state, action: PayloadAction<boolean>) {
      state.userAgreement = action.payload;
    },
    clearUser(state) {
      state.id = null;
      state.userId = null;
      state.username = null;
      state.userAgreement = null;
      state.isAdmin = null;
      state.isWriter = null;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, setUserAgreement, clearUser, setLoading } =
  userSlice.actions;
export default userSlice.reducer;
