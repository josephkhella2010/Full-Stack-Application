import { call, put, select, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

import { apiRequest } from "../../../utilities/HeaderFunction";
import type { UserType } from "../../../utilities/interfaces";

import { setUserById } from "../../reduxSlices/userSlice/UserSlice";

import {
  setLoading,
  setError,
  setClearLoading,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";
import type { RootState } from "../../store";

interface GetUserByIdType {
  uid: string;
}

interface GetUserResponseType {
  success: boolean;
  user: UserType;
}

// 1. API function
async function FetchUserByIdUrl(
  uid: string,
  token: string,
): Promise<GetUserResponseType> {
  const data = await apiRequest({
    api: "",
    endpoint: `users/${uid}`,
    method: "GET",
    token,
  });

  return data;
}

// 2. Get user by ID Saga
function* FetchUserById(action: PayloadAction<GetUserByIdType>): SagaIterator {
  try {
    yield put(setLoading());

    // Get token from the correct Redux state
    const token: string | null = yield select(
      (state: RootState) => state.userSlice.userStore.token,
    );

    if (!token) {
      throw new Error("You must log in first");
    }

    // Call backend API
    const data: GetUserResponseType = yield call(
      FetchUserByIdUrl,
      action.payload.uid,
      token,
    );

    //console.log("User API response:", data);

    // Save user in Redux
    yield put(setUserById(data.user));

    yield put(setClearLoading());

    toast.success("User profile loaded successfully!");
  } catch (error: unknown) {
    let message = "Failed to retrieve user";

    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;

      if (typeof serverMessage === "string") {
        message = serverMessage;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));

    toast.error(message);
  }
}

// 3. Watcher Saga
export function* WatchFetchUserById(): SagaIterator {
  yield takeLatest("FETCH_USER_BY_ID", FetchUserById);
}
