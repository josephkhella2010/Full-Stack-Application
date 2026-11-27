import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookType } from "../../../utilities/interfaces";

interface InitialStateType {
  books: BookType[];
  bookById: null | BookType;
  userBooks: BookType[];
  userBook: null | BookType;
}

const initialState: InitialStateType = {
  books: [],
  bookById: null,
  userBooks: [],
  userBook: null,
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
    setAddBookToUser: (state, action: PayloadAction<BookType>) => {
      state.userBooks.push(action.payload);
    },
  },
});

export const { setBooks, setBookById, setAddBookToUser } = bookSlice.actions;

export default bookSlice.reducer;
