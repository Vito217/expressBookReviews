const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    return isValid(username);
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

const getBooks = () => {
    return new Promise((resolve, reject) => {
        // Here we get the book list from the database
        // We simulate this event by calling books
        if (books) {
            resolve(books);
        }
        else {
            reject("Couldn't fetch books");
        }
    });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooks()
     .then((outBooks) =>{
        return res.send(JSON.stringify(outBooks));
     })
     .catch((error) =>{
        return res.status(404).json({message: error});
     });
});

const getBookByISBN = (inISBN) => {
    return new Promise((resolve, reject) => {
        // Here we get the book from the database
        // We simulate this event by calling books
        let book = books[inISBN];
        if (book) {
            resolve(book);
        }
        else {
            reject("Couldn't fetch book");
        }
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  getBookByISBN(isbn)
    .then((book) => {
        return res.send(JSON.stringify(book));
    })
    .catch((error) => {
        return res.status(404).json({message: error});
    });
 });

const getBookByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        let ISBNs = Object.keys(books);
        for (const ISBN of ISBNs)
        {
            let book = books[ISBN];
            if (book.author == author)
            {
                resolve(book);
                return;
            }
        }
        reject("Book not found");
    });
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  getBookByAuthor(author)
    .then((book) => {
        return res.send(JSON.stringify(book));
    })
    .catch((error) => {
        return res.status(404).json({message: error});
    });
});

const getBookByTitle = (title) => {
    return new Promise((resolve, reject) => {
        let ISBNs = Object.keys(books);
        for (const ISBN of ISBNs)
        {
            let book = books[ISBN];
            if (book.title == title)
            {
                resolve(book);
                return;
            }
        }
        reject("Book not found");
    });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    getBookByTitle(title)
      .then((book) => {
        return res.send(JSON.stringify(book));
      })
      .catch((error) => {
        return res.status(404).json({message: error});
      });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
