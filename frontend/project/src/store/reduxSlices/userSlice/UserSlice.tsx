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
    setDeleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(
        (u) => String(u.firebaseUid) !== String(action.payload),
      );
      state.user = null;
      state.userStore = {
        userStoraged: null,
        token: null,
      };

      localStorage.removeItem("user");
      toast.success("you are Logged Out");
    },
    setUpdateUser: (
      state,
      action: PayloadAction<{ data: UserType; id: string }>,
    ) => {
      const { data, id } = action.payload;

      // Update the user in the users array
      const findIndex = state.users.findIndex(
        (u) => String(u.firebaseUid) === id,
      );

      if (findIndex !== -1) {
        state.users[findIndex] = {
          ...state.users[findIndex],
          ...data,
        };
      }

      // Update the currently selected user
      if (state.user?.firebaseUid === id) {
        state.user = {
          ...state.user,
          ...data,
        };
      }

      // Update the logged-in user in userStore
      if (state.userStore.userStoraged?.firebaseUid === id) {
        state.userStore.userStoraged = {
          ...state.userStore.userStoraged,
          ...data,
        };

        // Save the updated user and preserve the token
        localStorage.setItem("user", JSON.stringify(state.userStore));
      }
    },
  },
});

export const {
  setUsers,
  setUser,
  setUserById,
  setUserStore,
  setLogOut,
  setDeleteUser,
  setUpdateUser,
} = userSlice.actions;

export default userSlice.reducer;
