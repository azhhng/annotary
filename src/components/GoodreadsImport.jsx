import { useState } from "react";
import { useBooks } from "../hooks/useBooks";

function GoodreadsImport({ onClose }) {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const { addBooks } = useBooks();

  const parseCSV = (csvText) => {
    console.log("🔍 Starting CSV parsing...");
    const lines = csvText.split("\n");
    console.log(`📄 Total lines in CSV: ${lines.length}`);

    const headerLine = lines[0];
    console.log("📋 Parsing header line:", headerLine.substring(0, 200) + "...");
    
    const headers = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < headerLine.length; i++) {
      const char = headerLine[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        headers.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    headers.push(current.trim());
    
    console.log(`📊 Found ${headers.length} columns:`, headers);

    const books = [];

    const titleIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("title")
    );
    const authorIndex = headers.findIndex((h) => h.toLowerCase() === "author");
    const additionalAuthorsIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("additional authors")
    );
    const myRatingIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("my rating")
    );
    const dateReadIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("date read")
    );
    const exclusiveShelfIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("exclusive shelf")
    );
    const myReviewIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("my review")
    );

    console.log("🔢 Column indices found:");
    console.log(`  Title: ${titleIndex} (${headers[titleIndex]})`);
    console.log(`  Author: ${authorIndex} (${headers[authorIndex]})`);
    console.log(`  Additional Authors: ${additionalAuthorsIndex} (${headers[additionalAuthorsIndex]})`);
    console.log(`  My Rating: ${myRatingIndex} (${headers[myRatingIndex]})`);
    console.log(`  Date Read: ${dateReadIndex} (${headers[dateReadIndex]})`);
    console.log(`  Exclusive Shelf: ${exclusiveShelfIndex} (${headers[exclusiveShelfIndex]})`);
    console.log(`  My Review: ${myReviewIndex} (${headers[myReviewIndex]})`);

    let processedCount = 0;
    let skippedCount = 0;
    let readBooksCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        skippedCount++;
        continue;
      }

      processedCount++;
      if (processedCount <= 5 || processedCount % 10 === 0) {
        console.log(`📖 Processing line ${i + 1}/${lines.length}: ${line.substring(0, 100)}...`);
      }

      const row = [];
      let current = "";
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          row.push(current.replace(/^"|"$/g, "").trim());
          current = "";
        } else {
          current += char;
        }
      }
      row.push(current.replace(/^"|"$/g, "").trim());

      // Only import books that have been read
      const exclusiveShelf = row[exclusiveShelfIndex]?.trim();
      if (exclusiveShelf !== "read") {
        if (processedCount <= 5) {
          console.log(`⏭️ Skipping book on shelf "${exclusiveShelf}" (not "read")`);
        }
        continue;
      }

      readBooksCount++;
      const title = row[titleIndex]?.trim();
      const author = row[authorIndex]?.trim();
      const additionalAuthors = row[additionalAuthorsIndex]?.trim();
      const rating = parseFloat(row[myRatingIndex]) || 0;
      const dateRead = row[dateReadIndex]?.trim();
      const myReview = row[myReviewIndex]?.trim() || "";

      if (readBooksCount <= 5) {
        console.log(`📚 Found "read" book #${readBooksCount}:`);
        console.log(`  Title: "${title}"`);
        console.log(`  Author: "${author}"`);
        console.log(`  Additional Authors: "${additionalAuthors}"`);
        console.log(`  Rating: ${rating}`);
        console.log(`  Date Read: "${dateRead}"`);
        console.log(`  Review: "${myReview?.substring(0, 50)}${myReview?.length > 50 ? '...' : ''}"`);
      }

      if (!title || !author) {
        console.log(`⚠️ Skipping book with missing title or author: title="${title}", author="${author}"`);
        continue;
      }

      // Build authors array
      const authors = [author];
      if (additionalAuthors && additionalAuthors !== "") {
        const additionalAuthorsList = additionalAuthors
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a);
        authors.push(...additionalAuthorsList);
      }

      // Convert Goodreads date format to HTML date format
      const formatDate = (dateStr) => {
        if (!dateStr || dateStr === "") return "";

        // Handle different Goodreads date formats
        // Format: YYYY/MM/DD or YYYY-MM-DD
        let parts;
        if (dateStr.includes("/")) {
          parts = dateStr.split("/");
        } else if (dateStr.includes("-")) {
          parts = dateStr.split("-");
        } else {
          return "";
        }

        if (parts.length === 3) {
          const year = parts[0];
          const month = parts[1].padStart(2, "0");
          const day = parts[2].padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
        return "";
      };

      const bookData = {
        title,
        authors,
        genres: [], // Goodreads doesn't export genres
        dateStarted: "", // Not available in Goodreads export
        dateFinished: formatDate(dateRead),
        rating: rating > 0 ? rating : null, // Use null for unrated books
        notes: myReview,
        tags: [], // Could potentially use Bookshelves data??
        emojis: [],
        isPublic: false,
      };

      if (books.length <= 5) {
        console.log(`✅ Added book #${books.length + 1} to import list:`, bookData);
      }

      books.push(bookData);
    }

    console.log(`🎯 Parsing complete! Statistics:`);
    console.log(`  Total lines processed: ${processedCount}`);
    console.log(`  Empty lines skipped: ${skippedCount}`);
    console.log(`  Books marked as "read": ${readBooksCount}`);
    console.log(`  Books added to import list: ${books.length}`);

    return books;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid CSV file");
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    console.log(`🚀 Starting import process for file: ${file.name}`);
    setImporting(true);
    setResults(null);

    try {
      const text = await file.text();
      console.log(`📄 File read successfully, size: ${text.length} characters`);
      
      const books = parseCSV(text);

      if (books.length === 0) {
        console.log("❌ No books found to import");
        setResults({
          success: 0,
          failed: 0,
          total: 0,
          message:
            'No readable books found in the CSV file. Make sure the file is a Goodreads export and contains books marked as "read".',
        });
        setImporting(false);
        return;
      }

      console.log(`📤 Attempting to import ${books.length} books to database...`);
      const result = await addBooks(books);
      const successCount = result.success.length;
      const failCount = result.failed.length;

      console.log(`✅ Import complete! Success: ${successCount}, Failed: ${failCount}`);

      setResults({
        success: successCount,
        failed: failCount,
        total: books.length,
        message: `Import completed! ${successCount} books imported successfully${failCount > 0 ? `, ${failCount} failed` : ""}.`,
      });
    } catch (error) {
      console.error("❌ Import error:", error);
      setResults({
        success: 0,
        failed: 0,
        total: 0,
        message:
          "Failed to parse CSV file. Please make sure it's a valid Goodreads export.",
      });
    }

    setImporting(false);
  };

  return (
    <div className="container-sm bg-glass">
      <h2>Import from Goodreads</h2>

      <div className="form">
        <div className="form-group">
          <label>
            <strong>How to export from Goodreads:</strong>
          </label>
          <ol style={{ marginLeft: "1rem", lineHeight: "1.5" }}>
            <li>Go to Goodreads.com and sign in</li>
            <li>Click "My Books" in the top navigation</li>
            <li>Scroll to bottom and click "Import and export"</li>
            <li>Click "Export Library" and download the CSV file</li>
            <li>Select that CSV file below</li>
          </ol>
        </div>

        <div className="form-group">
          <label htmlFor="csvFile">Select Goodreads CSV Export File:</label>
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div className="form-group">
            <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>
              Selected: {file.name}
            </p>
            <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.7 }}>
              <strong>Note:</strong> Only books marked as "read" will be
              imported. Emojis and genres will need to be added manually after
              import.
            </p>
          </div>
        )}

        {results && (
          <div
            className={`message ${results.success > 0 ? "success" : "error"}`}
          >
            <strong>Import Results:</strong>
            <br />
            {results.message}
            {results.total > 0 && (
              <div
                style={{ marginTop: "0.5rem", fontSize: "var(--font-size-sm)" }}
              >
                Total books processed: {results.total}
                <br />
                Successfully imported: {results.success}
                <br />
                {results.failed > 0 && `Failed to import: ${results.failed}`}
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={!file || importing}
          >
            {importing ? "Importing..." : "Import Books"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={importing}
          >
            {results && results.success > 0 ? "Close" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoodreadsImport;
