import { call, put, select, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

import { apiRequest } from "../../../utilities/HeaderFunction";
import { setDeleteUser } from "../../reduxSlices/userSlice/UserSlice";

import {
  setLoading,
  setError,
  setClearLoading,
  setSuccess,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

interface DeleteUserType {
  uid: string;
}

interface DeleteResponseType {
  success: boolean;
  message: string;
}

interface UserStateType {
  userSlice: {
    userStore: {
      token: string | null;
    };
  };
}

// 1. API function
async function FetchDeleteUserUrl(
  uid: string,
  token: string,
): Promise<DeleteResponseType> {
  const data = await apiRequest({
    api: "users/",
    endpoint: `${uid}`,
    method: "DELETE",
    token,
  });

  return data;
}

// 2. Delete user Saga
function* FetchDeleteUser(action: PayloadAction<DeleteUserType>): SagaIterator {
  try {
    yield put(setLoading());
    yield put(setSuccess(false));

    // Get Firebase token from Redux
    const token: string | null = yield select(
      (state: UserStateType) => state.userSlice.userStore.token,
    );

    if (!token) {
      throw new Error("You must log in first");
    }

    // Call DELETE API
    const data: DeleteResponseType = yield call(
      FetchDeleteUserUrl,
      action.payload.uid,
      token,
    );

    // Clear Redux user data and localStorage
    yield put(setDeleteUser(action.payload.uid));

    yield put(setSuccess(true));
    yield put(setClearLoading());

    toast.success(data.message || "Account deleted successfully!");
  } catch (error: unknown) {
    let message = "Failed to delete account. Please try again.";

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
export function* WatchFetchDeleteUser(): SagaIterator {
  yield takeLatest("FETCH_DELETE_USER", FetchDeleteUser);
}
