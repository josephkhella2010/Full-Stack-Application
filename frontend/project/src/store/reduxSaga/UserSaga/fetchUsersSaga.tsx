import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { PayloadAction } from "@reduxjs/toolkit";

import {
  setClearLoading,
  setError,
  setLoading,
  setSuccess,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

import { setUsers } from "../../reduxSlices/userSlice/UserSlice";
import { apiRequest } from "../../../utilities/HeaderFunction";

import type { UserType } from "../../../utilities/interfaces";

// API response type
interface UsersResponse {
  success: boolean;
  count: number;
  users: UserType[];
}

// 1. Fetch API function
async function FetchApiUrl(): Promise<UserType[]> {
  const data: UsersResponse = await apiRequest({
    api: "users",
    method: "GET",
    endpoint: "",
  });

  return data.users;
}

// 2. Saga function
function* FetchGetUsers(
  _action: PayloadAction<string | undefined>,
): SagaIterator {
  try {
    yield put(setLoading());

    const users: UserType[] = yield call(FetchApiUrl);

    yield put(setUsers(users));
    yield put(setSuccess(true));
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));
  } finally {
    yield put(setClearLoading());
  }
}

// 3. Watcher
export function* WatchFetchGetUsers(): SagaIterator {
  yield takeLatest("FETCH_ALL_USERS", FetchGetUsers);
}
