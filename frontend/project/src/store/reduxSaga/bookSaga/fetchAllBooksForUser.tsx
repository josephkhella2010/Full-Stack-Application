import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../store";
import type { BookType } from "../../../utilities/interfaces";

import { apiRequest } from "../../../utilities/HeaderFunction";

import { setBooksUser } from "../../reduxSlices/bookSlice/BookSlice";

import {
  setLoading,
  setError,
  setSuccess,
  setClearLoading,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

interface GetUserBooksResponse {
  success: boolean;
  message: string;
  count: number;
  books: BookType[];
}

// API request
const getUserBooksRequest = (uid: string, token: string) => {
  return apiRequest({
    api: "books/user/",
    endpoint: `${uid}`,
    method: "GET",
    token,
  });
};

// Worker saga
function* fetchUserBooksSaga(action: PayloadAction<string>) {
  try {
    yield put(setLoading());

    const token: string | null = yield select(
      (state: RootState) => state.userSlice.userStore.token,
    );

    if (!token) {
      throw new Error("You must be logged in to fetch your books");
    }

    const response: GetUserBooksResponse = yield call(
      getUserBooksRequest,
      action.payload,
      token,
    );

    yield put(setBooksUser(response.books));
    yield put(setSuccess(true));
    yield put(setClearLoading());
  } catch (error) {
    let message = "Failed to fetch your books";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));
    yield put(setClearLoading());
  }
}

// Watcher saga
export function* watchFetchUserBooks() {
  yield takeLatest("FETCH_USER_BOOKS", fetchUserBooksSaga);
}
