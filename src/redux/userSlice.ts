import { LS_USER_BASIC } from "@constants/localStorage";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserSubExtend } from "@services/users";

// 1. Define the base data type to avoid repeating keys
interface UserData {
  id: number | null;
  userId: string | null;
  username: string | null;
  picture: string | null;
  email: string | null;
  userAgreement: boolean | null;
  emailVerified: boolean | null;
  isAdmin: boolean | null;
  isWriter: boolean | null;
  isBannerMan: boolean | null;
  isReviewer: boolean | null;
  renewSubscription: boolean | null;
  stripeCustomerId: string | null;
  userSubExtend: UserSubExtend | null;
}

interface UserState extends UserData {
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
  isBannerMan: null,
  isReviewer: null,
  renewSubscription: null,
  stripeCustomerId: null,
  userSubExtend: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 2. Use Partial<UserData> to allow updating any number of fields at once
    setUser(state, action: PayloadAction<Partial<UserData>>) {
      Object.assign(state, action.payload);
      state.isLoading = false;

      const userStr = localStorage.getItem(LS_USER_BASIC);

      const user = userStr ? JSON.parse(userStr) : {};
      const storageData = { ...user, ...action.payload, updatedAt: Date.now() };
      localStorage.setItem(LS_USER_BASIC, JSON.stringify(storageData));
    },
    setUserAgreement(state, action: PayloadAction<boolean>) {
      state.userAgreement = action.payload;
    },
    // 3. To clear, simply return the initial state (but keep isLoading false)
    clearUser: () => {
      localStorage.removeItem(LS_USER_BASIC);
      return { ...initialState, isLoading: false };
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, setUserAgreement, clearUser, setLoading } =
  userSlice.actions;
export default userSlice.reducer;
