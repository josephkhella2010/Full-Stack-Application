import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { RootState, AppDispatch } from "../../store/store";

const BooksPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { books } = useSelector((state: RootState) => state.bookSlice);

  const { isLoading, error } = useSelector(
    (state: RootState) => state.loadingErrorSlice,
  );

  const [title, setTitle] = useState("");

  // Choose which sorting method is active
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  // Date sorting
  const [dateOrder, setDateOrder] = useState<"asc" | "desc">("desc");

  // Alphabetical sorting
  const [titleOrder, setTitleOrder] = useState<"az" | "za">("az");

  useEffect(() => {
    dispatch({
      type: "FETCH_ALL_BOOKS",
      payload: {
        title: title.trim() || undefined,
        sortBy,
        dateOrder,
        titleOrder,
      },
    });
  }, [dispatch, title, sortBy, dateOrder, titleOrder]);

  return (
    <div className="books-page">
      <h1>Our Books</h1>

      <div className="books-controls">
        {/* Search by title */}
        <div>
          <label htmlFor="titleSearch">Search by title:</label>
          <input
            id="titleSearch"
            type="text"
            placeholder="Search books..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Choose sorting method */}
        <div>
          <label htmlFor="sortBy">Sort books by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "title")}
          >
            <option value="date">Date</option>
            <option value="title">Alphabetically</option>
          </select>
        </div>

        {/* Date sorting direction */}
        {sortBy === "date" && (
          <div>
            <label htmlFor="dateOrder">Sort by date:</label>
            <select
              id="dateOrder"
              value={dateOrder}
              onChange={(e) => setDateOrder(e.target.value as "asc" | "desc")}
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        )}

        {/* Alphabetical sorting direction */}
        {sortBy === "title" && (
          <div>
            <label htmlFor="titleOrder">Sort alphabetically:</label>
            <select
              id="titleOrder"
              value={titleOrder}
              onChange={(e) => setTitleOrder(e.target.value as "az" | "za")}
            >
              <option value="az">A - Z</option>
              <option value="za">Z - A</option>
            </select>
          </div>
        )}
      </div>

      <h2>Books ({books.length})</h2>

      {isLoading && <p>Loading books...</p>}

      {error && <p>Error: {error}</p>}

      {!isLoading && !error && books.length === 0 && <p>No books found.</p>}

      {!isLoading && !error && books.length > 0 && (
        <div className="books-grid">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <h2>{book.title}</h2>

              <p>
                <strong>Author:</strong> {book.author}
              </p>

              <p>{book.description}</p>

              <button
                type="button"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                Show Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
