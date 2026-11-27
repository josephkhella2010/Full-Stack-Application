import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { setBooks } from "../../reduxSlices/bookSlice/BookSlice";

import {
  setLoading,
  setError,
  setSuccess,
  setClearLoading,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

import { apiRequest } from "../../../utilities/HeaderFunction";

import type { RootState } from "../../store";
import type { BookType } from "../../../utilities/interfaces";

// Query parameters
interface BookQuery extends Record<
  string,
  string | number | boolean | undefined
> {
  title?: string;
  sortBy?: "date" | "title";
  dateOrder?: "asc" | "desc";
  titleOrder?: "az" | "za";
}

// API response
interface GetBooksResponse {
  success: boolean;
  message: string;
  count: number;
  books: BookType[];
}

// GET all books request
const getBooksRequest = (token: string, params?: BookQuery) => {
  return apiRequest({
    api: "books",
    endpoint: "",
    method: "GET",
    token,
    params,
  });
};

// Fetch all books saga
function* fetchBooksSaga(action: PayloadAction<BookQuery | undefined>) {
  try {
    yield put(setLoading());

    // Get Firebase token from Redux store
    const token: string | null = yield select(
      (state: RootState) => state.userSlice.userStore.token,
    );

    if (!token) {
      throw new Error("You must be logged in to fetch books");
    }

    // Fetch books from backend
    const response: GetBooksResponse = yield call(
      getBooksRequest,
      token,
      action.payload,
    );

    // Save books in Redux
    yield put(setBooks(response.books));

    yield put(setSuccess(true));
    yield put(setClearLoading());
  } catch (error) {
    let message = "Failed to fetch books";

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
export function* watchFetchBooks() {
  yield takeLatest("FETCH_ALL_BOOKS", fetchBooksSaga);
}
