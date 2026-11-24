import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

import { apiRequest } from "../../../utilities/HeaderFunction";
import type { UserType } from "../../../utilities/interfaces";

import { setUserStore } from "../../reduxSlices/userSlice/UserSlice";

import {
  setLoading,
  setError,
  setClearLoading,
  setSuccess,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

// Login request data
interface LoginUserType {
  email: string;
  password: string;
}

// Login API response
interface LoginResponseType {
  success: boolean;
  message: string;
  token: string;
  user: UserType;
}

// 1. API function
async function FetchLoginUrl(
  userData: LoginUserType,
): Promise<LoginResponseType> {
  const data = await apiRequest({
    api: "",
    endpoint: "login",
    method: "POST",
    body: userData,
  });

  return data;
}

// 2. Login Saga
function* FetchLoginUser(action: PayloadAction<LoginUserType>): SagaIterator {
  try {
    yield put(setLoading());
    yield put(setSuccess(false));

    // Call backend login API
    const data: LoginResponseType = yield call(FetchLoginUrl, action.payload);

    // Save user and token in Redux and localStorage
    yield put(
      setUserStore({
        userStoraged: data.user,
        token: data.token,
      }),
    );

    yield put(setSuccess(true));

    toast.success(data.message || "Login successful!");

    // Stop loading after successful login
    yield put(setClearLoading());
  } catch (error: unknown) {
    let message = "Login failed. Please try again.";

    // Get error message from backend
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
export function* WatchFetchLoginUser(): SagaIterator {
  yield takeLatest("FETCH_LOGIN_USER", FetchLoginUser);
}
