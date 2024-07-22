const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate that both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is already taken
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already taken" });
  }

  // Add the new user to the users array
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).json({ books });
}
);

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: 'Book not found' })
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const result = []

  for (const key in books) {
    if (books[key].author.toLowerCase() === author) {
      result.push(books[key])
    }
    if (result.length > 0) {
      return res.status(200).json(result)
    } else {

      return res.status(404).json({ message: "No books found by this author" });
    }
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const result = []

  for (const key in books) {
    if (books[key].title.toLowerCase() === title) {
      result.push(books[key])
    }
    if (result.length > 0) {
      return res.status(200).json(result)
    }
  }
  return res.status(404).json({ message: "No books found under this title" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn].reviews
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: 'Review not found' })
  }
});

module.exports.general = public_users;
