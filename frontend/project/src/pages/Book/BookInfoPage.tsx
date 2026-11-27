import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import type { RootState, AppDispatch } from "../../store/store";

function BookDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams<{ id: string }>();

  const book = useSelector((state: RootState) => state.bookSlice.bookById);

  const isLoading = useSelector(
    (state: RootState) => state.loadingErrorSlice.isLoading,
  );

  const error = useSelector(
    (state: RootState) => state.loadingErrorSlice.error,
  );

  useEffect(() => {
    if (id) {
      dispatch({
        type: "FETCH_BOOK_BY_ID",
        payload: Number(id),
      });
    }
  }, [dispatch, id]);

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
        <button>Add to My Library</button>
        <button> Loan Book</button>
      </div>
    </div>
  );
}

export default BookDetailsPage;
