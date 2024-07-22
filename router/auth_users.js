const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  console.log("Login attempt:", { username, password });
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: 'Invalid username' })
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid password' })
  }
  const token = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });
  return res.status(200).json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.body;

  if (!isbn || !review) {
    return res.status(400).json({ message: 'ISBN and review are required' })
  }

  const book = books[isbn]
  if (!book) {
    return res.status(404).json({ message: 'Book not found' })
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[req.user.username] = review;
  return res.status(200).json({ message: 'Review added successfully', review: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  const book = books[isbn]
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const review = book.reviews[req.user.username]
  if (review) {
    delete book.reviews[req.user.username];
    return res.status(200).json({ message: 'Your review deleted successfully' })
  } else {
    return res.status(404).json({ message: 'Review not found' })
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
