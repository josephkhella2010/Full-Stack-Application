import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookType } from "../../../utilities/interfaces";
import { toast } from "react-toastify";

interface InitialStateType {
  books: BookType[];
}

const initialState: InitialStateType = {
  books: [],
};

const bookSlice = createSlice({
  name: "bookSlice",
  initialState,

  reducers: {
    setBooks: (state, action: PayloadAction<BookType[]>) => {
      state.books = action.payload;
    },
  },
});

export const { setBooks } = bookSlice.actions;

export default bookSlice.reducer;
