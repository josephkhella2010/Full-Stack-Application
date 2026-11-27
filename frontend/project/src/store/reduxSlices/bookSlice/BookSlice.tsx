import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookType } from "../../../utilities/interfaces";

interface InitialStateType {
  books: BookType[];
  bookById: null | BookType;
}

const initialState: InitialStateType = {
  books: [],
  bookById: null,
};

const bookSlice = createSlice({
  name: "bookSlice",
  initialState,

  reducers: {
    setBooks: (state, action: PayloadAction<BookType[]>) => {
      state.books = action.payload;
    },
    setBookById: (state, action: PayloadAction<BookType>) => {
      state.bookById = action.payload;
    },
  },
});

export const { setBooks, setBookById } = bookSlice.actions;

export default bookSlice.reducer;
