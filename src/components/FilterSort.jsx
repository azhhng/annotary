import { useState } from "react";

function FilterSort({
  filters,
  sortBy,
  filterOptions,
  hasActiveFilters,
  onFilterChange,
  onClearFilters,
  onSortChange,
  onClearSort,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="filters">
      <h4
        className="filters-header"
        onClick={() => setShowFilters(!showFilters)}
      >
        Filters {showFilters ? "▼" : "▶"}
      </h4>

      {showFilters && (
        <div className="filters-content">
          <div className="filter-group">
            <label>Genre</label>
            <select
              value={filters.genre}
              onChange={(e) => onFilterChange("genre", e.target.value)}
            >
              <option value="">All genres</option>
              {filterOptions.genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => onFilterChange("rating", e.target.value)}
            >
              <option value="">All ratings</option>
              {filterOptions.ratings.map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Tag</label>
            <select
              value={filters.tag}
              onChange={(e) => onFilterChange("tag", e.target.value)}
            >
              <option value="">All tags</option>
              {filterOptions.tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Author</label>
            <select
              value={filters.author}
              onChange={(e) => onFilterChange("author", e.target.value)}
            >
              <option value="">All authors</option>
              {filterOptions.authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Emoji</label>
            <select
              value={filters.emoji}
              onChange={(e) => onFilterChange("emoji", e.target.value)}
            >
              <option value="">All emojis</option>
              {filterOptions.emojis.map((emoji) => (
                <option key={emoji} value={emoji}>
                  {emoji}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={onClearFilters}>
              Clear filters
            </button>
          )}

          <div className="sort-section">
            <h4>Sort</h4>
            <div className="filter-group">
              <label>Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="">No sorting</option>
                <option value="rating">Rating (high to low)</option>
                <option value="title">Book name (A-Z)</option>
                <option value="author">Author name (A-Z)</option>
                <option value="dateFinished">
                  Finished date (recent first)
                </option>
              </select>
            </div>

            {sortBy && (
              <button className="clear-filters-btn" onClick={onClearSort}>
                Clear sorting
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterSort;
