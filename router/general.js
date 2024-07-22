const express = require('express');
const axios = require('axios');
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

// Get the book list available in the shop using Async-Await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://example.com/books'); // Replace with your actual books API URL
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
      resolve(book);
    } else {
      reject('Book not found');
    }
  })
    .then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  new Promise((resolve, reject) => {
    const author = req.params.author.toLowerCase();
    const result = [];

    for (const key in books) {
      if (books[key].author.toLowerCase() === author) {
        result.push(books[key]);
      }
    }

    if (result.length > 0) {
      resolve(result);
    } else {
      reject('No books found by this author');
    }
  })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title.toLowerCase();
    const result = [];

    for (const key in books) {
      if (books[key].title.toLowerCase() === title) {
        result.push(books[key]);
      }
    }

    if (result.length > 0) {
      resolve(result);
    } else {
      reject('No books found under this title');
    }
  })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
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
