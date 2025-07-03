import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";
import ColorPicker from "../components/ColorPicker";
import FilterSort from "../components/FilterSort";
import EditableTitle from "../components/EditableTitle";
import Navigation from "../components/Navigation";
import { useBooks } from "../hooks/useBooks";
import { useBookFilters } from "../hooks/useBookFilters";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useJournaler } from "../hooks/useJournaler";

function UserJournal() {
  const [showForm, setShowForm] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const {
    journaler,
    updateColors,
    updateJournalTitle,
  } = useJournaler();

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

  const currentBgColors = bgColors;
  const currentFontColor = fontColor;
  const currentJournalTitle = journaler?.journal_title || journalTitle;

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, ${currentBgColors.start} 0%, ${currentBgColors.end} 100%)`;
  }, [currentBgColors]);

  useEffect(() => {
    if (!journaler) {
      document.body.style.background = `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;
    }
  }, [journaler]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-color",
      currentFontColor
    );
  }, [currentFontColor]);

  useEffect(() => {
    document.title = `${username}'s ${currentJournalTitle}`;
  }, [currentJournalTitle, username]);

  useEffect(() => {
    return () => {
      if (colorUpdateTimeoutRef.current) {
        clearTimeout(colorUpdateTimeoutRef.current);
      }
    };
  }, []);

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

  const handleAddBook = (newBook) => {
    addBook(newBook);
    setShowForm(false);
  };

  const handleUpdateBook = (updatedBook) => {
    updateBook(updatedBook);
  };

  const handleEditBook = (book) => {
    startEditing(book);
  };

  const handleCancelEdit = () => {
    cancelEditing();
  };

  const handleOpenAddForm = () => {
    cancelEditing();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };


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

  const handleBgColorsChange = async (updateFn) => {
    const newBgColors =
      typeof updateFn === "function" ? updateFn(currentBgColors) : updateFn;

    if (journaler) {
      setBgColors(newBgColors);
      debouncedColorUpdate(
        newBgColors.start,
        newBgColors.end,
        currentFontColor
      );
    } else {
      setBgColors(newBgColors);
    }
  };

  const handleFontColorChange = async (newFontColor) => {
    if (journaler) {
      setFontColor(newFontColor);
      debouncedColorUpdate(
        currentBgColors.start,
        currentBgColors.end,
        newFontColor
      );
    } else {
      setFontColor(newFontColor);
    }
  };

  const handleTitleChange = async (newTitle) => {
    if (journaler) {
      await updateJournalTitle(newTitle);
    } else {
      setJournalTitle(newTitle);
    }
  };

  if (loading || booksLoading) {
    return (
      <div className="app">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="app">
      <ColorPicker
        bgColors={currentBgColors}
        setBgColors={handleBgColorsChange}
        fontColor={currentFontColor}
        setFontColor={handleFontColorChange}
      />

      <header className="app-header">
        <EditableTitle
          title={currentJournalTitle}
          onTitleChange={handleTitleChange}
        />
      </header>

      <Navigation
        activeTab="journal"
        user={user}
        onLogout={handleLogout}
        showSearch={false}
      />

      <main className="main-content">
        {showForm && !editingBook && (
          <div className="form-section">
            <h2>Add book</h2>
            <BookForm
              onAddBook={handleAddBook}
              onUpdateBook={handleUpdateBook}
              onCancel={() => setShowForm(false)}
              editingBook={null}
            />
          </div>
        )}

        <div className="books-section">
          <div className="books-container">
            <div className="sidebar">
              <button
                className="add-book-btn"
                onClick={() => {
                  if (showForm && !editingBook) {
                    setShowForm(false);
                  } else if (showForm && editingBook) {
                    handleCancelEdit();
                  } else {
                    handleOpenAddForm();
                  }
                }}
              >
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

            {books.length === 0 ? (
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
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserJournal;
