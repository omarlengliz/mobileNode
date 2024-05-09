const Book = require("../models/Book");
const Users = require("../models/Users");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("genre");

    res.status(200).json({ status: "success", data: books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch books", error: error.message });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id).populate("genre");

    res.status(200).json({ status: "success", data: book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch book", error: error.message });
  }
};

const addBook = async (req, res) => {
  const {
    name,
    author,
    genre,
    pages,
    pageContent,
    releaseDate,
    language,
    imageUrl,
  } = req.body;

  try {
    const book = await Book.create({
      name,
      author,
      genre,
      pages,
      pageContent,
      releaseDate,
      language,
      imageUrl,
    });

    const admin = require("firebase-admin");

    const users = await Users.find({}).select("fcmToken");
    const userTokens = users.map(user => user.fcmToken);

    // Prepare notification message
    const message = {
      notification: {
        title: `The ${name} book has been added!!`,
        body: "Check it out on our application",
      },
      android: {
        notification: {
          imageUrl: imageUrl,
        },
      },
      apns: {
        payload: {
          aps: {
            "mutable-content": 1,
          },
        },
        fcm_options: {
          image: "https://foo.bar.pizza-monster.png",
        },
      },
      webpush: {
        headers: {
          image: "a",
        },
      },

    };
    userTokens.forEach(async token => {
      message.token = token;
      console.log("Sending notification to:"  , token);
      const response = await admin.messaging().send(message).then((res) => {
  
      });
      if(response){
        console.log("Notification sent successfully:", response);
      }else{
        console.log("Notification not sent");
      }
  

    });

    // Send notifications to all FCM tokens


    res.status(201).json({ status: "success", data: book });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ message: "Failed to send notifications", error: error.message });
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    author,
    genre,
    pages,
    pageContent,
    releaseDate,
    language,
    imageUrl,
  } = req.body;

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      {
        name,
        author,
        genre,
        pages,
        pageContent,
        releaseDate,
        language,
        imageUrl,
      },
      { new: true }
    );

    res.status(200).json({ status: "success", data: book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update book", error: error.message });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndDelete(id);

    res.status(200).json({ status: "success", data: book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete book", error: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};
