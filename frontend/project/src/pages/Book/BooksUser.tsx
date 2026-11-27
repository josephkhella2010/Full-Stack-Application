import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { RootState, AppDispatch } from "../../store/store";

export default function BooksUser() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector(
    (state: RootState) => state.userSlice.userStore.userStoraged,
  );

  const userBooks = useSelector(
    (state: RootState) => state.bookSlice.userBooks,
  );

  const isLoading = useSelector(
    (state: RootState) => state.loadingErrorSlice.isLoading,
  );

  const error = useSelector(
    (state: RootState) => state.loadingErrorSlice.error,
  );

  useEffect(() => {
    if (user?.firebaseUid) {
      dispatch({
        type: "FETCH_USER_BOOKS",
        payload: user.firebaseUid,
      });
    }
  }, [dispatch, user?.firebaseUid]);

  if (isLoading) {
    return <p>Loading your books...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (userBooks.length === 0) {
    return <p>You haven't added any books to your library yet.</p>;
  }

  return (
    <div>
      <h1>My Library</h1>

      <div>
        {userBooks.map((book) => (
          <div key={book.id}>
            <h2>{book.title}</h2>
            <h3>{book.author}</h3>
            <p>{book.description}</p>

            {book.imgs?.map((img, index) => (
              <img key={index} src={img} alt={book.title} width="150" />
            ))}

            <button onClick={() => navigate(`/book/${book.id}`)}>
              View Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
