import { useState, useMemo } from 'react'

export function useBookFilters(books) {
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    tag: '',
    author: ''
  })
  const [sortBy, setSortBy] = useState('')

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      genre: '',
      rating: '',
      tag: '',
      author: ''
    })
  }

  const clearSort = () => {
    setSortBy('')
  }

  const filterOptions = useMemo(() => ({
    genres: [...new Set(books.map(book => book.genre).filter(Boolean))],
    ratings: [...new Set(books.map(book => book.rating))].sort((a, b) => b - a),
    tags: [...new Set(books.flatMap(book => book.tags || []))],
    authors: [...new Set(books.map(book => book.author).filter(Boolean))].sort()
  }), [books])

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const genreMatch = !filters.genre || book.genre === filters.genre
      const ratingMatch = !filters.rating || book.rating === parseFloat(filters.rating)
      const tagMatch = !filters.tag || (book.tags && book.tags.includes(filters.tag))
      const authorMatch = !filters.author || book.author === filters.author

      return genreMatch && ratingMatch && tagMatch && authorMatch
    })
  }, [books, filters])

  const sortedBooks = useMemo(() => {
    const getLastName = (fullName) => {
      const names = fullName.trim().split(' ')
      return names[names.length - 1]
    }

    return [...filteredBooks].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'title':
          return a.title.localeCompare(b.title)
        case 'author':
          return getLastName(a.author).localeCompare(getLastName(b.author))
        case 'dateFinished':
          if (!a.dateFinished && !b.dateFinished) return 0
          if (!a.dateFinished) return 1
          if (!b.dateFinished) return -1
          return new Date(b.dateFinished) - new Date(a.dateFinished)
        default:
          return 0
      }
    })
  }, [filteredBooks, sortBy])

  const hasActiveFilters = filters.genre || filters.rating || filters.tag || filters.author

  return {
    filters,
    sortBy,
    filterOptions,
    sortedBooks,
    hasActiveFilters,
    handleFilterChange,
    clearFilters,
    setSortBy,
    clearSort
  }
}
