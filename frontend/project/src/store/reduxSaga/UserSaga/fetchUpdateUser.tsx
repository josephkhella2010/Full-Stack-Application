import { call, put, select, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

import { apiRequest } from "../../../utilities/HeaderFunction";
import type { UserType } from "../../../utilities/interfaces";

import { setUpdateUser } from "../../reduxSlices/userSlice/UserSlice";

import {
  setLoading,
  setError,
  setClearLoading,
  setSuccess,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

interface UpdateUserPayload {
  data: UserType;
  id: string;
}

interface UpdateResponseType {
  success: boolean;
  message: string;
  user: UserType;
}

interface UserStateType {
  userSlice: {
    userStore: {
      token: string | null;
    };
  };
}

// 1. API function
async function FetchUpdateUserUrl(
  data: UserType,
  id: string,
  token: string,
): Promise<UpdateResponseType> {
  const response = await apiRequest({
    api: "users/",
    endpoint: `${id}`,
    method: "PUT",
    token,
    body: data,
  });

  return response;
}

// 2. Saga function
function* FetchUpdateUser(
  action: PayloadAction<UpdateUserPayload>,
): SagaIterator {
  try {
    yield put(setLoading());
    yield put(setSuccess(false));

    const token: string | null = yield select(
      (state: UserStateType) => state.userSlice.userStore.token,
    );

    if (!token) {
      throw new Error("You must log in first");
    }

    const { data, id } = action.payload;

    const response: UpdateResponseType = yield call(
      FetchUpdateUserUrl,
      data,
      id,
      token,
    );

    // Update Redux state with the updated user
    yield put(
      setUpdateUser({
        data: response.user,
        id,
      }),
    );

    yield put(setSuccess(true));
    yield put(setClearLoading());

    toast.success(response.message || "User updated successfully!");
  } catch (error: unknown) {
    let message = "Failed to update user. Please try again.";

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

// 3. Watcher
export function* WatchFetchUpdateUser(): SagaIterator {
  yield takeLatest("FETCH_UPDATE_USER", FetchUpdateUser);
}
