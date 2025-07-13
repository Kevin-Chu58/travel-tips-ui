import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number | null;
  username: string | null;
  isLoading: boolean;
}

const initialState: UserState = {
  id: null,
  username: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: number; username: string }>) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.isLoading = false;
    },
    clearUser(state) {
      state.id = null;
      state.username = null;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
