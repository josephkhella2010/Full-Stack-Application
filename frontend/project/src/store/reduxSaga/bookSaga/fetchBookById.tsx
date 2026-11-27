import { call, put, select, takeLatest } from "redux-saga/effects";
import axios from "axios";

import { setBookById } from "../../reduxSlices/bookSlice/BookSlice";

import {
  setLoading,
  setError,
  setSuccess,
  setClearLoading,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

import { apiRequest } from "../../../utilities/HeaderFunction";
import type { RootState } from "../../store";
import type { BookType } from "../../../utilities/interfaces";

interface GetBookResponse {
  success: boolean;
  message: string;
  book: BookType;
}

// API request
const getBookByIdRequest = (id: number, token: string) => {
  return apiRequest({
    api: "books",
    endpoint: `/${id}`,
    method: "GET",
    token,
  });
};

// Worker Saga
function* fetchBookByIdSaga(action: { type: string; payload: number }) {
  try {
    yield put(setLoading());

    const token: string | null = yield select(
      (state: RootState) => state.userSlice.userStore.token,
    );

    if (!token) {
      throw new Error("You must be logged in to fetch this book");
    }

    const response: GetBookResponse = yield call(
      getBookByIdRequest,
      action.payload,
      token,
    );

    yield put(setBookById(response.book));
    yield put(setSuccess(true));
    yield put(setClearLoading());
  } catch (error) {
    let message = "Failed to fetch book";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));
    yield put(setClearLoading());
  }
}

// Watcher Saga
export function* watchFetchBookById() {
  yield takeLatest("FETCH_BOOK_BY_ID", fetchBookByIdSaga);
}
