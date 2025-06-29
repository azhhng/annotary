# 📚 Reading Journal

A personal reading journal app.

## Features

- **Add & Edit Books** - Track title, author, genre, start/finish dates, and personal notes
- **Half-Star Ratings** - Rate books from 0.5 to 5 stars with half star support
- **Custom Tags** - Add any tags you want
- **Local Storage** - All data stored in a JSON file

## Data Storage

Books are stored in `src/data/books.json`. We can manually edit this file or go through the website UI. Each book entry looks like:

```json
{
  "id": 1,
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "dateStarted": "2024-01-15",
  "dateFinished": "2024-01-22",
  "rating": 4.5,
  "notes": "Your thoughts about the book...",
  "tags": ["favorite", "summer read", "beautiful writing"]
}
```

## Built With

- **React**
- **Vite**
- **CSS3**
