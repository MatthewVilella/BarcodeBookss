const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require('./types/env.d');

// Middleware for parsing application/json data
app.use(bodyParser.json());

// Importing the Firebase Admin SDK and Natural Language Toolkit (Natural)
const admin = require("firebase-admin");
const natural = require('natural');

// Variable to store titles from the POST request
let storedTitles = [];

// URL for fetching book data using UPC
let url = "https://api.upcitemdb.com/prod/trial/lookup?upc=";

// Reference to a specific collection in the Firestore database
let collectionRef;

// Initializing Firebase Admin SDK with a service account credential and establishing a connection to Firestore
let serviceAccount = require('./firebaseServiceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
let fireBase = admin.firestore();
fireBase.settings({ ignoreUndefinedProperties: true });

// Function to fetch book data using UPC API
const fetchUpcApi = async (findBookUrl, userUID, userScanning) => {
    try {
        const response = await fetch(findBookUrl);
        const fetchedData = await response.json();

        const item = fetchedData.items[0];
        if (!item.isbn) { return console.log("Not a book"); }
        const image = item.images[1] || 'NO IMAGE';
        await googleBooks(item.title, item.publisher, image, userUID, userScanning);
    }
    catch (error) { console.error("Error fetching book data:", error); }
};

// Fetch book details from Google Books API and handle Firestore operations
const googleBooks = async (title, publisher, image, userUID, userScanning) => {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}`);
        const fetchedData = await response.json();

        let ratio = 100;
        let book = {
            title: title,
            authors: "Not Available",
            publisher: publisher,
            publishedDate: "Not Available",
            description: "Not Available",
            pageCount: "Not Available",
            categories: "Not Available",
            image: image,
        };

        // Compare titles and select the closest match
        if (fetchedData && fetchedData.items) {
            fetchedData.items.forEach(item => {
                const distance = natural.LevenshteinDistance(item.volumeInfo.title, title);
                if (distance < ratio) {
                    ratio = distance;
                    book = {
                        title: item.volumeInfo.title || title,
                        authors: item.volumeInfo.authors || "Not Available",
                        publisher: item.volumeInfo.publisher || publisher,
                        publishedDate: item.volumeInfo.publishedDate || "Not Available",
                        description: item.volumeInfo.description || "Not Available",
                        pageCount: item.volumeInfo.pageCount || "Not Available",
                        categories: item.volumeInfo.categories || "Not Available",
                        image: item.volumeInfo.imageLinks?.thumbnail || image,
                    };
                }
            });
        }
        await handleFirestoreOperations(book, userUID, userScanning);
    }
    catch (error) { console.error("Error fetching Google Books data:", error); };
};

// Add or update book data in Firestore
const handleFirestoreOperations = async (book, userUID, userScanning) => {
    try {
        const bookDocument = await fireBase.collection("bookIndex").doc(book.title).get();
        const usersBookDocument = await fireBase.collection("userUID").doc(userUID).collection(userScanning).doc(book.title).get();

        // Add book to user's collection if it exists in the index but not in the user's collection
        if (bookDocument.exists && !usersBookDocument.exists) {
            const firebaseBook = bookDocument.data().title;
            await fireBase.collection("userUID").doc(userUID).collection(userScanning).doc(firebaseBook).set({ Title: firebaseBook });
        }
        // Add book to both the index and user's collection if it doesn't exist in either
        else if (!usersBookDocument.exists) { await fireBase.collection("userUID").doc(userUID).collection(userScanning).doc(book.title).set({ Title: book.title }); };

        // Add book to the index if it doesn't exist
        if (!bookDocument.exists) { await fireBase.collection("bookIndex").doc(book.title).set(book); };
    }
    catch (error) { console.error("Error handling Firestore operations:", error); };
};

// Delete a book from a user's collection in Firestore
const deleteBook = async (fireBase, userUID, userDeletingItem, bookTitle) => {
    try { await fireBase.collection("userUID").doc(userUID).collection(userDeletingItem).doc(bookTitle).delete(); }
    catch (error) { console.error("Error deleting book:", error); };
};

// Add a book to a user's favorites in Firestore
const addToFavorites = async (fireBase, userUID, userDeletingItem, bookTitle) => {
    try { await fireBase.collection("userUID").doc(userUID).collection(userDeletingItem).doc(bookTitle).update({ ["Favorites"]: bookTitle }); }
    catch (error) { console.error("Error adding book to favorites:", error); };
};

// Remove a book from a user's favorites in Firestore
const removeFromFavorites = async (fireBase, userUID, userDeletingItem, bookTitle) => {
    const docRef = fireBase.collection("userUID").doc(userUID).collection(userDeletingItem).doc(bookTitle);
    const res = await docRef.update({ Favorites: admin.firestore.FieldValue.delete() });
};

// Delete a user's entire database
async function deleteUsersDataBase(userUID, userDeleting) {
    const deleteCollectionRef = fireBase.collection("userUID").doc(userUID).collection(userDeleting);
    const querySnapshot = await deleteCollectionRef.get();

    const deletePromises = [];
    querySnapshot.forEach((doc) => { deletePromises.push(doc.ref.delete()); });

    await Promise.all(deletePromises);
}

app.get("/", (req, res) => {
    res.json("API is running and is all good")
});

// Route to add a book to the database using UPC
app.post(`${config.ROUTE_ONE}`, (req, res) => {
    const { Upc, userUID, User } = req.body;
    const findBookUrl = `${url}${Upc}`;

    fetchUpcApi(findBookUrl, userUID, User)
        .then(() => res.sendStatus(200))
        .catch(error => {
            console.error("Error adding book to database:", error);
            res.sendStatus(500);
        });
});

// Route to delete a book from a user's collection
app.post(`${config.ROUTE_TWO}`, (req, res) => {
    const { userUidDeleting, userDeleting, deleteBook: bookTitle } = req.body;

    deleteBook(fireBase, userUidDeleting, userDeleting, bookTitle)
        .then(() => res.sendStatus(200))
        .catch(error => {
            console.error("Error deleting book:", error);
            res.sendStatus(500);
        });
});

// Route to add a book to the user's favorites
app.post(`${config.ROUTE_THREE}`, (req, res) => {
    const { userUidDeleting, userDeleting, deleteBook: bookTitle } = req.body;

    addToFavorites(fireBase, userUidDeleting, userDeleting, bookTitle)
        .then(() => res.sendStatus(200))
        .catch(error => {
            console.error("Error adding book to favorites:", error);
            res.sendStatus(500);
        });
});

// Route to remove a book from the user's favorites
app.post(`${config.ROUTE_FOUR}`, async (req, res) => {
    const { userUidDeleting, userDeleting, deleteBook: bookTitle } = req.body;

    try {
        await removeFromFavorites(fireBase, userUidDeleting, userDeleting, bookTitle);
        res.status(200).send({ message: 'Successfully removed from favorites' });
    }
    catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).send({ error: 'Failed to remove from favorites' });
    };
});

// Route to delete a user's entire collection in Firestore
app.post(`${config.ROUTE_FIVE}`, async (req, res) => {
    let requestBody = req.body;

    try {
        await deleteUsersDataBase(requestBody.deleteUserUID, requestBody.deleteUserEmail);
        res.sendStatus(200);
    }
    catch (error) {
        console.error("Error deleting collection:", error);
        res.status(500).send("An error occurred while deleting the collection.");
    };
});


// Route to set up Firestore collection reference for accessing user-specific data
app.post(`${config.ROUTE_SIX}`, (req, res, next) => {
    let requestBody = req.body;
    collectionRef = fireBase.collection("userUID").doc(requestBody.userUID).collection(requestBody.user);
    next();
});

// Route to retrieve user-specific data from Firestore
app.get(`${config.ROUTE_SEVEN}`, (req, res) => {
    let returnUpcItemDetails = [];
    let filterDuplicates = [];

    collectionRef.get().then(upcItemDetails => {
        upcItemDetails.forEach(doc => {
            returnUpcItemDetails.push({ title: doc.data().Title, favorites: doc.data().Favorites });
        });

        const newData = returnUpcItemDetails.filter(book => !filterDuplicates.includes(book));
        filterDuplicates = filterDuplicates.concat(newData);
        res.send(newData);
    })
        .catch(err => { console.log("Error getting documents", err); });
});

// Endpoint to post titles and retrieve data from Firestore database
app.post(`${config.ROUTE_EIGHT}`, async (req, res) => {
    const titlesArray = req.body.titles;
    const titles = titlesArray.map(titleObj => titleObj.title).filter(title => title !== undefined);

    try {
        storedTitles = titles;

        const booksData = [];
        const collectionRef = admin.firestore().collection("bookIndex");
        const querySnapshot = await collectionRef.where(admin.firestore.FieldPath.documentId(), "in", titles).get();

        querySnapshot.forEach(doc => {
            const bookData = doc.data();
            booksData.push(bookData);
        });

        res.status(200).json({ books: booksData });
    }
    catch (error) {
        console.error("Error processing request: ", error);
        res.status(500).json({ error: 'Internal Server Error' });
    };
});

// Endpoint to retrieve all books data from Firestore database
app.get(`${config.ROUTE_NINE}`, async (req, res) => {
    try {
        const booksData = [];

        const collectionRef = admin.firestore().collection("bookIndex");
        const querySnapshot = await collectionRef.where(admin.firestore.FieldPath.documentId(), "in", storedTitles).get();

        querySnapshot.forEach(doc => {
            const bookData = doc.data();
            booksData.push(bookData);
        });

        res.status(200).json({ books: booksData });
    }
    catch (error) {
        console.error("Error processing request: ", error);
        res.status(500).json({ error: 'Internal Server Error' });
    };
});


// Setting up Express to parse incoming requests as JSON and handle URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Exporting the app object to be used as a module in other files
module.exports = app;
