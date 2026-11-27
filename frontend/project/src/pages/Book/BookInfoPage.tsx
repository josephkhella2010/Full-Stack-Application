import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { RootState, AppDispatch } from "../../store/store";

function BookDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  const book = useSelector((state: RootState) => state.bookSlice.bookById);

  const user = useSelector(
    (state: RootState) => state.userSlice.userStore.userStoraged,
  );

  const isLoading = useSelector(
    (state: RootState) => state.loadingErrorSlice.isLoading,
  );

  const error = useSelector(
    (state: RootState) => state.loadingErrorSlice.error,
  );

  // Check whether the book belongs to the logged-in user
  const alreadyAdded = book?.userId === user?.firebaseUid;

  // Check whether another user has added the book
  const alreadyTaken =
    book?.userId !== null &&
    book?.userId !== undefined &&
    book?.userId !== user?.firebaseUid;

  useEffect(() => {
    if (id) {
      dispatch({
        type: "FETCH_BOOK_BY_ID",
        payload: Number(id),
      });
    }

    if (user?.firebaseUid) {
      dispatch({
        type: "FETCH_USER_BOOKS",
        payload: user.firebaseUid,
      });
    }
  }, [dispatch, id, user?.firebaseUid]);

  // Add book to logged-in user's library
  const handleAddBook = () => {
    if (
      !book ||
      !user?.firebaseUid ||
      alreadyAdded ||
      alreadyTaken ||
      isLoading
    ) {
      return;
    }

    dispatch({
      type: "ADD_BOOK_TO_USER",
      payload: {
        bookId: book.id,
        userId: user.firebaseUid,
      },
    });
  };

  if (isLoading) {
    return <p>Loading book...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!book) {
    return <p>Book not found.</p>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <h2>{book.author}</h2>
      <p>{book.description}</p>

      {book.imgs?.map((img, index) => (
        <img key={index} src={img} alt={book.title} width="200" />
      ))}

      <div>
        <button
          onClick={handleAddBook}
          disabled={
            !user?.firebaseUid || alreadyAdded || alreadyTaken || isLoading
          }
        >
          {alreadyAdded
            ? "Already in My Library"
            : alreadyTaken
              ? "Already taken"
              : !user?.firebaseUid
                ? "Login to add book"
                : "Add to My Library"}
        </button>

        <button>Loan Book</button>
      </div>
    </div>
  );
}

export default BookDetailsPage;
