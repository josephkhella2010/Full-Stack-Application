import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserType } from "../../../utilities/interfaces";
import { toast } from "react-toastify";

const storageUser = localStorage.getItem("user");
const parsedUser: StoragedUserType = storageUser
  ? JSON.parse(storageUser)
  : {
    userStoraged: null,
    token: null,
  };
interface StoragedUserType {
  userStoraged: UserType | null;
  token: string | null;
}

interface InitialStateType {
  users: UserType[];
  user: UserType | null;
  userStore: StoragedUserType;
}

const initialState: InitialStateType = {
  users: [],
  user: null,
  userStore: parsedUser,
  // user: parsedUser,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,

  reducers: {
    setUsers: (state, action: PayloadAction<UserType[]>) => {
      state.users = action.payload;
    },
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setUserById: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setUserStore: (state, action: PayloadAction<StoragedUserType>) => {
      state.userStore = action.payload;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLogOut: (state) => {
      state.userStore = {
        userStoraged: null,
        token: null,
      };

      localStorage.removeItem("user");
      toast.success("you are Logged Out");
    },
  },
});

export const { setUsers, setUser, setUserById, setUserStore, setLogOut } =
  userSlice.actions;

export default userSlice.reducer;
