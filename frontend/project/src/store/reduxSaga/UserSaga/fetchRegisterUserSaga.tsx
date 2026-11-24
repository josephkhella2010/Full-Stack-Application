/* import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { PayloadAction } from "@reduxjs/toolkit";

import { apiRequest } from "../../../utilities/HeaderFunction";
import type { UserType } from "../../../utilities/interfaces";

import { setUser } from "../../reduxSlices/userSlice/UserSlice";

import {
  setLoading,
  setError,
  setClearLoading,
  setSuccess,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

// Registration data
interface RegisterUserType {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

// 1. API function
async function FetchRegisterUrl(userData: RegisterUserType): Promise<UserType> {
  const data = await apiRequest({
    api: "register",
    method: "POST",
    endpoint: "",
    body: userData,
  });

  return data.user;
}

// 2. Registration Saga
function* FetchRegisterUser(
  action: PayloadAction<RegisterUserType>,
): SagaIterator {
  try {
    yield put(setLoading());
    yield put(setSuccess(false));

    const user: UserType = yield call(FetchRegisterUrl, action.payload);

    yield put(setUser(user));
    yield put(setSuccess(true));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    yield put(setError(message));
  } finally {
    yield put(setClearLoading());
  }
}

// 3. Watcher
export function* WatchFetchRegisterUser(): SagaIterator {
  yield takeLatest("FETCH_REGISTER_USER", FetchRegisterUser);
}
 */

import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

import { apiRequest } from "../../../utilities/HeaderFunction";
import type { UserType } from "../../../utilities/interfaces";

import { setUser } from "../../reduxSlices/userSlice/UserSlice";

import {
  setLoading,
  setError,
  setClearLoading,
  setSuccess,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

// Registration data
interface RegisterUserType {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

// 1. API function
async function FetchRegisterUrl(userData: RegisterUserType): Promise<UserType> {
  const data = await apiRequest({
    api: "",
    method: "POST",
    endpoint: "register",
    body: userData,
  });

  return data.user;
}

// 2. Registration Saga
function* FetchRegisterUser(
  action: PayloadAction<RegisterUserType>,
): SagaIterator {
  try {
    yield put(setLoading());
    yield put(setSuccess(false));

    const user: UserType = yield call(FetchRegisterUrl, action.payload);

    yield put(setUser(user));
    yield put(setSuccess(true));

    toast.success("Registration successful!");
  } catch (error: unknown) {
    let message = "Registration failed";

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.message || error.message || "Registration failed";
    } else if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));

    toast.error(message);
  } finally {
    yield put(setClearLoading());
  }
}

// 3. Watcher
export function* WatchFetchRegisterUser(): SagaIterator {
  yield takeLatest("FETCH_REGISTER_USER", FetchRegisterUser);
}
