import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserSlicerType {
  // accessToken: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  phoneNumber: string | null;
  photoURL: string | null;

  providerId: string;
  uid: string;
  refreshToken: string;
}

const userInitialState: UserSlicerType = {
  // accessToken: "",
  displayName: null,
  email: null,
  emailVerified: false,
  isAnonymous: false,
  phoneNumber: null,
  photoURL: null,

  providerId: "",
  uid: "",
  refreshToken: "",
};

const userSlicer = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserSlicerType>) => {
      console.log("http://localhost:5173/", "added");

      state = { ...action.payload };
    },
    clearUser: () => {
      return { ...userInitialState };
    },
    // updateAccessToken: (state, action: PayloadAction<string>) => {
    //   state.accessToken = action.payload;
    // },
  },
});

export const { addUser, clearUser } = userSlicer.actions;
export default userSlicer;
