import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

import { apiRequest } from "../../../utilities/HeaderFunction";
import type { RootState } from "../../store";

import { setDeleteUserToBook } from "../../reduxSlices/bookSlice/BookSlice";

import {
  setLoading,
  setError,
  setSuccess,
  setClearLoading,
} from "../../reduxSlices/LoadingSlice/LoadingAndErrorSlice";

interface DeleteUserBookResponse {
  success: boolean;
  message: string;
}

const deleteUserBookRequest = (bookId: string, token: string) => {
  return apiRequest({
    api: "my-library/",
    endpoint: `${bookId}`,
    method: "DELETE",
    token,
  });
};

function* deleteUserBookSaga(action: PayloadAction<string>) {
  try {
    yield put(setLoading());

    const token: string | null = yield select(
      (state: RootState) => state.userSlice.userStore.token,
    );

    if (!token) {
      throw new Error("You must be logged in to remove a book");
    }

    const response: DeleteUserBookResponse = yield call(
      deleteUserBookRequest,
      action.payload,
      token,
    );

    if (response.success) {
      yield put(setDeleteUserToBook(action.payload));
      yield put(setSuccess(true));
      toast.success(
        response.message || "Book removed from your library successfully",
      );
    }

    yield put(setClearLoading());
  } catch (error) {
    let message = "Failed to remove book from your library";

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

export function* watchDeleteUserBook() {
  yield takeLatest("DELETE_USER_BOOK", deleteUserBookSaga);
}
