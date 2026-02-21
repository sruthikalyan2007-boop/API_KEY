const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory array to store book objects
let books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: '1984', author: 'George Orwell' }
];

// Helper function to generate a new unique ID
const generateId = () => {
    return books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
};

// GET /books - Return all books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// POST /books - Add a new book from request body
app.post('/books', (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }

    const newBook = {
        id: generateId(),
        title,
        author
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT /books/:id - Update a book by id
app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, author } = req.body;

    const bookIndex = books.findIndex(b => b.id === id);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    // Update fields if provided
    if (title) books[bookIndex].title = title;
    if (author) books[bookIndex].author = author;

    res.status(200).json(books[bookIndex]);
});

// DELETE /books/:id - Remove a book
app.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const bookIndex = books.findIndex(b => b.id === id);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = books.splice(bookIndex, 1);
    res.status(200).json({ message: 'Book deleted successfully', deletedBook: deletedBook[0] });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
