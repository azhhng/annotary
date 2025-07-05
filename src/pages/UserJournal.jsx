import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";
import ColorPicker from "../components/ColorPicker";
import FilterSort from "../components/FilterSort";
import { useBooks } from "../hooks/useBooks";
import { useBookFilters } from "../hooks/useBookFilters";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { createGradientBackground } from "../constants/colors";

function UserJournal({ journaler, updateColors }) {
  const [showForm, setShowForm] = useState(false);
  const { username } = useParams();
  const { user, loading } = useAuth();

  const {
    bgColors,
    setBgColors,
    fontColor,
    setFontColor,
    journalTitle,
    setJournalTitle,
  } = useTheme();

  useEffect(() => {
    if (journaler) {
      setBgColors({
        start: journaler.gradient_start_color,
        end: journaler.gradient_end_color,
      });
      setFontColor(journaler.font_color);
      setJournalTitle(journaler.journal_title);
    }
  }, [journaler, setBgColors, setFontColor, setJournalTitle]);

  const currentJournalTitle = useMemo(
    () => journaler?.journal_title || journalTitle,
    [journaler?.journal_title, journalTitle]
  );

  useEffect(() => {
    document.body.style.background = createGradientBackground(
      bgColors.start,
      bgColors.end
    );
  }, [bgColors]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-color", fontColor);
  }, [fontColor]);

  useEffect(() => {
    document.title = `${username}'s ${currentJournalTitle}`;
  }, [currentJournalTitle, username]);

  const {
    books,
    editingBook,
    loading: booksLoading,
    addBook,
    updateBook,
    deleteBook,
    startEditing,
    cancelEditing,
  } = useBooks();

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

  const handleAddBook = useCallback(
    (newBook) => {
      addBook(newBook);
      setShowForm(false);
    },
    [addBook]
  );

  const handleUpdateBook = useCallback(
    (updatedBook) => {
      updateBook(updatedBook);
    },
    [updateBook]
  );

  const handleEditBook = useCallback(
    (book) => {
      startEditing(book);
    },
    [startEditing]
  );

  const handleCancelEdit = useCallback(() => {
    cancelEditing();
  }, [cancelEditing]);

  const handleOpenAddForm = useCallback(() => {
    cancelEditing();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cancelEditing]);

  const colorUpdateTimeoutRef = useRef(null);

  const debouncedColorUpdate = useCallback(
    (gradientStart, gradientEnd, fontColor) => {
      if (colorUpdateTimeoutRef.current) {
        clearTimeout(colorUpdateTimeoutRef.current);
      }

      colorUpdateTimeoutRef.current = setTimeout(() => {
        if (journaler) {
          updateColors(gradientStart, gradientEnd, fontColor);
        }
      }, 1000);
    },
    [journaler, updateColors]
  );

  const handleBgColorsChange = useCallback(
    async (updateFn) => {
      const newBgColors =
        typeof updateFn === "function" ? updateFn(bgColors) : updateFn;

      if (journaler) {
        setBgColors(newBgColors);
        debouncedColorUpdate(newBgColors.start, newBgColors.end, fontColor);
      } else {
        setBgColors(newBgColors);
      }
    },
    [bgColors, fontColor, journaler, setBgColors, debouncedColorUpdate]
  );

  const handleFontColorChange = useCallback(
    async (newFontColor) => {
      if (journaler) {
        setFontColor(newFontColor);
        debouncedColorUpdate(bgColors.start, bgColors.end, newFontColor);
      } else {
        setFontColor(newFontColor);
      }
    },
    [bgColors, journaler, setFontColor, debouncedColorUpdate]
  );

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
  }, []);

  const handleToggleAddForm = useCallback(() => {
    if (showForm && !editingBook) {
      setShowForm(false);
    } else if (showForm && editingBook) {
      handleCancelEdit();
    } else {
      handleOpenAddForm();
    }
  }, [showForm, editingBook, handleCancelEdit, handleOpenAddForm]);

  if (loading || booksLoading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center" style={{ marginTop: "2rem" }}>
        <h2>Sign up to continue</h2>
        <p>Create an account to start your own reading journal.</p>
      </div>
    );
  }

  return (
    <>
      <ColorPicker
        bgColors={bgColors}
        setBgColors={handleBgColorsChange}
        fontColor={fontColor}
        setFontColor={handleFontColorChange}
      />


      <div className="books-section">
        <div className="books-container">
          <div className="sidebar">
            <button className="btn btn-primary" onClick={handleToggleAddForm}>
              {showForm ? "Cancel" : "Add book"}
            </button>

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

          {books.length === 0 && !showForm ? (
            <div className="books-grid">
              <p>No books yet. Add your first book!</p>
            </div>
          ) : (
            <BookList
              books={sortedBooks}
              onEditBook={handleEditBook}
              onDeleteBook={deleteBook}
              editingBook={editingBook}
              onUpdateBook={handleUpdateBook}
              onCancelEdit={handleCancelEdit}
              showActions={true}
              showAddForm={showForm && !editingBook}
              onAddBook={handleAddBook}
              onCancelAddForm={handleFormCancel}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default UserJournal;
