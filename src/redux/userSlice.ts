import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number | null;
  userId: string | null;
  username: string | null;
  picture: string | null;
  email: string | null;
  userAgreement: boolean | null;
  emailVerified: boolean | null;
  isAdmin: boolean | null;
  isWriter: boolean | null;
  isLoading: boolean;
}

const initialState: UserState = {
  id: null,
  userId: null,
  username: null,
  picture: null,
  email: null,
  userAgreement: null,
  emailVerified: null,
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
        id?: number;
        userId?: string;
        username?: string;
        picture?: string;
        email?: string;
        userAgreement?: boolean;
        emailVerified?: boolean;
        isAdmin?: boolean;
        isWriter?: boolean;
      }>,
    ) {
      if (action.payload.id) state.id = action.payload.id;
      if (action.payload.userId) state.userId = action.payload.userId;
      if (action.payload.username) state.username = action.payload.username;
      if (action.payload.picture) state.picture = action.payload.picture;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.userAgreement !== undefined)
        state.userAgreement = action.payload.userAgreement;
      if (action.payload.emailVerified !== undefined)
        state.emailVerified = action.payload.emailVerified;
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
      state.picture = null;
      state.email = null;
      state.userAgreement = null;
      state.emailVerified = null;
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
