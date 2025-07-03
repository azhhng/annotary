import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BookList from "../components/BookList";
import FilterSort from "../components/FilterSort";
import { useUserBooks } from "../hooks/useUserBooks";
import { useBookFilters } from "../hooks/useBookFilters";
import { useTheme } from "../hooks/useTheme";

function OtherUserJournal() {
  const { username } = useParams();
  const { books, loading, userInfo } = useUserBooks(username);

  const { bgColors, setBgColors, fontColor, setFontColor, setJournalTitle } =
    useTheme();

  const {
    filters,
    sortBy,
    filterOptions,
    sortedBooks,
    hasActiveFilters,
    handleFilterChange,
    clearFilters,
    setSortBy,
    clearSort,
  } = useBookFilters(books);

  // Apply the other user's theme
  useEffect(() => {
    if (userInfo) {
      setBgColors({
        start: userInfo.gradient_start_color,
        end: userInfo.gradient_end_color,
      });
      setFontColor(userInfo.font_color);
      setJournalTitle(userInfo.journal_title);
    }
  }, [userInfo, setBgColors, setFontColor, setJournalTitle]);

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, ${bgColors.start} 0%, ${bgColors.end} 100%)`;
  }, [bgColors]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-color", fontColor);
  }, [fontColor]);

  useEffect(() => {
    document.title = `${username}'s ${userInfo?.journal_title || "Journal"}`;
  }, [username, userInfo]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>User not found</h2>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem" }}>
          The user "{username}" doesn't exist or hasn't created a journal yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            color: fontColor,
            fontSize: "1rem",
            fontWeight: "normal",
          }}
        >
          {userInfo.journal_title}
        </h1>
      </div>

      <div className="books-section">
        <div className="books-container">
          <div className="sidebar">
            {books.length > 0 && (
              <FilterSort
                filters={filters}
                sortBy={sortBy}
                filterOptions={filterOptions}
                hasActiveFilters={hasActiveFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                onSortChange={setSortBy}
                onClearSort={clearSort}
              />
            )}
          </div>

          {books.length === 0 ? (
            <div className="books-grid">
              <p>{username} hasn't shared any books yet.</p>
            </div>
          ) : (
            <BookList
              books={sortedBooks}
              onEditBook={() => {}}
              onDeleteBook={() => {}}
              editingBook={null}
              onUpdateBook={() => {}}
              onCancelEdit={() => {}}
              showActions={false}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default OtherUserJournal;
