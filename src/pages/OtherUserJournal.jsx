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
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="text-center" style={{ marginTop: '2rem' }}>
        <h2>User not found</h2>
        <p>
          The user "{username}" doesn't exist or hasn't created a journal yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: fontColor }}>
          {userInfo.journal_title}
        </h1>
      </div>

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
    </>
  );
}

export default OtherUserJournal;
