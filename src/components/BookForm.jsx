import { useState, useEffect } from "react";

function BookForm({ onAddBook, onUpdateBook, onCancel, editingBook = null }) {
  const [formData, setFormData] = useState({
    title: "",
    authors: [],
    genre: "",
    dateStarted: "",
    dateFinished: "",
    rating: 1,
    notes: "",
    tags: [],
    emojis: [],
  });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || "",
        authors: editingBook.authors || [],
        genre: editingBook.genre || "",
        dateStarted: editingBook.dateStarted || "",
        dateFinished: editingBook.dateFinished || "",
        rating: editingBook.rating || 1,
        notes: editingBook.notes || "",
        tags: editingBook.tags || [],
        emojis: editingBook.emojis || [],
      });
    }
  }, [editingBook]);

  const [tagInput, setTagInput] = useState("");
  const [emojiInput, setEmojiInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAuthor = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (authorInput.trim() && !formData.authors.includes(authorInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          authors: [...prev.authors, authorInput.trim()],
        }));
        setAuthorInput("");
      }
    }
  };

  const removeAuthor = (authorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((author) => author !== authorToRemove),
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const isEmoji = (str) => {
    const hasLettersOrNumbers = /[a-zA-Z0-9]/.test(str.trim());
    return !hasLettersOrNumbers && str.trim().length > 0;
  };

  const handleAddEmoji = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const trimmedInput = emojiInput.trim();

      if (!trimmedInput) return;

      if (!isEmoji(trimmedInput)) {
        alert("Please enter only emojis (no letters or numbers)");
        return;
      }

      if (formData.emojis.includes(trimmedInput)) {
        alert("This emoji is already added");
        return;
      }

      if (formData.emojis.length >= 3) {
        alert("Maximum of 3 emojis allowed");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        emojis: [...prev.emojis, trimmedInput],
      }));
      setEmojiInput("");
    }
  };

  const removeEmoji = (emojiToRemove) => {
    setFormData((prev) => ({
      ...prev,
      emojis: prev.emojis.filter((emoji) => emoji !== emojiToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || formData.authors.length === 0) {
      alert("Please fill in at least the title and one author");
      return;
    }

    const bookData = {
      ...formData,
      rating: parseFloat(formData.rating),
    };

    if (editingBook) {
      onUpdateBook({ ...bookData, id: editingBook.id });
    } else {
      onAddBook({ ...bookData, id: Date.now() });
    }

    if (!editingBook) {
      setFormData({
        title: "",
        authors: [],
        genre: "",
        dateStarted: "",
        dateFinished: "",
        rating: 1,
        notes: "",
        tags: [],
        emojis: [],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="authors">Author(s) *</label>
          <div className="tags-input-container">
            <input
              type="text"
              id="authors"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              onKeyDown={handleAddAuthor}
              placeholder="Add an author and press Enter"
            />
            <button type="button" onClick={handleAddAuthor} className="add-tag-btn">
              Add
            </button>
          </div>
          {formData.authors.length > 0 && (
            <div className="tags-display">
              {formData.authors.map((author, index) => (
                <span key={index} className="tag">
                  {author}
                  <button
                    type="button"
                    onClick={() => removeAuthor(author)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
          >
            {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((num) => (
              <option key={num} value={num}>
                {num}{" "}
                {num % 1 === 0
                  ? "⭐".repeat(num)
                  : "⭐".repeat(Math.floor(num)) + "⭐️"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dateStarted">Date Started</label>
          <input
            type="date"
            id="dateStarted"
            name="dateStarted"
            value={formData.dateStarted}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateFinished">Date Finished</label>
          <input
            type="date"
            id="dateFinished"
            name="dateFinished"
            value={formData.dateFinished}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          placeholder="What did you think about this book?"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <div className="tags-input-container">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type a tag and press Enter (e.g., favorite, drama)"
          />
          <button type="button" onClick={handleAddTag} className="add-tag-btn">
            Add
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="tags-display">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="emojis">Emojis (up to 3)</label>
        <div className="tags-input-container">
          <input
            type="text"
            id="emojis"
            value={emojiInput}
            onChange={(e) => setEmojiInput(e.target.value)}
            onKeyDown={handleAddEmoji}
            placeholder="Add an emoji and press Enter (e.g., 📚, 💕, 🌟)"
            disabled={formData.emojis.length >= 3}
          />
          <button
            type="button"
            onClick={handleAddEmoji}
            className="add-tag-btn"
            disabled={formData.emojis.length >= 3}
          >
            Add
          </button>
        </div>
        {formData.emojis.length > 0 && (
          <div className="tags-display">
            {formData.emojis.map((emoji, index) => (
              <span key={index} className="tag">
                {emoji}
                <button
                  type="button"
                  onClick={() => removeEmoji(emoji)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {formData.emojis.length >= 3 && (
          <p className="emoji-warning">Maximum of 3 emojis reached</p>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingBook ? "Update book" : "Add book"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default BookForm;
