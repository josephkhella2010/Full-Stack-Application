import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

import { apiRequest } from "../../../utilities/HeaderFunction";
import type { RootState } from "../../store";

import { setAddUserToBook } from "../../reduxSlices/bookSlice/BookSlice";

import {
  setLoading,
  setError,
  setSuccess,
  setClearLoading,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

import type { BookType } from "../../../utilities/interfaces";

interface AddBookToUserPayload {
  bookId: number;
  userId: string;
}

interface AddBookToUserResponse {
  success: boolean;
  message: string;
  book: BookType;
}

const addBookToUserRequest = (token: string, body: AddBookToUserPayload) => {
  return apiRequest({
    api: "add-user-book",
    endpoint: "",
    method: "POST",
    token,
    body,
  });
};

function* addBookToUserSaga(action: PayloadAction<AddBookToUserPayload>) {
  try {
    yield put(setLoading());

    const token: string | null = yield select(
      (state: RootState) => state.userSlice.userStore.token,
    );

    if (!token) {
      throw new Error("You must be logged in to add a book");
    }

    const response: AddBookToUserResponse = yield call(
      addBookToUserRequest,
      token,
      action.payload,
    );

    yield put(setAddUserToBook(response.book));
    yield put(setSuccess(true));

    toast.success("Book added to your library!");

    yield put(setClearLoading());
  } catch (error) {
    let message = "Failed to add book to your account";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    yield put(setError(message));

    toast.error(message);

    yield put(setClearLoading());
  }
}

export function* watchAddBookToUser() {
  yield takeLatest("ADD_BOOK_TO_USER", addBookToUserSaga);
}
