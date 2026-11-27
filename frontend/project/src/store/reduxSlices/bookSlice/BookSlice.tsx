import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookType } from "../../../utilities/interfaces";

interface InitialStateType {
  books: BookType[];
  bookById: null | BookType;
  userBooks: BookType[];
}

const initialState: InitialStateType = {
  books: [],
  bookById: null,
  userBooks: [],
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
    setBooksUser: (state, action: PayloadAction<BookType[]>) => {
      state.userBooks = action.payload;
    },
    setAddUserToBook: (state, action: PayloadAction<BookType>) => {
      state.userBooks.push(action.payload);
      if (state.bookById?.id === action.payload.id) {
        state.bookById = action.payload;
      }
    },
    setDeleteUserToBook: (state, action: PayloadAction<string>) => {
      // Remove book from user's library
      state.userBooks = state.userBooks.filter(
        (book) => String(book.id) !== String(action.payload),
      );

      // Update currently selected book
      if (
        state.bookById &&
        String(state.bookById.id) === String(action.payload)
      ) {
        state.bookById.userId = null;
      }

      // Update all books
      state.books = state.books.map((book) =>
        String(book.id) === String(action.payload)
          ? { ...book, userId: null }
          : book,
      );
    },
  },
});

export const {
  setBooks,
  setBookById,
  setBooksUser,
  setAddUserToBook,
  setDeleteUserToBook,
} = bookSlice.actions;

export default bookSlice.reducer;
