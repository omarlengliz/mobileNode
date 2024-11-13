const Book = require("../models/Book");
const Order = require("../models/Order");
const Users = require("../models/Users");
const multer = require('multer');
const path = require('path');
const stripe = require('stripe')('sk_test_51KSORWJTNlYsf9D6QoJ9FZoKq7NVMJ2ybI3NMrbpa2L6h1EBLbzy01mZD3bmtvDkN8ZjNOsn5JYfTxezdaxfL0Lh00b7VePMWg'); 


// Set up Multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // File name
  },
});

// Filter to accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only images are allowed!'), false);
  }
};

// Initialize Multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("genre").populate("author");

    res.status(200).json({ status: "success", data: books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch books", error: error.message });
  }
};
const getBooksA = async (req, res) => {
  console.log(req.user)
  try {
    if (req.user.role === 'admin') {

    const books = await Book.find().populate("genre").populate("author");
    res.status(200).json({ status: "success", data: books });
  }else{
    const books = await Book.find({author:req.user._id}).populate("genre").populate("author");
    res.status(200).json({ status: "success", data: books });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch books", error: error.message });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id).populate("genre").populate("author");

    res.status(200).json({ status: "success", data: book });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch book", error: error.message });
  }
};

// const addBook = async (req, res) => {
//   upload.single('imageUrl')(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ message: err.message });
//     }

//     const {
//       name,
//       genre,
//       pages, // Number of pages
//       pageContent, // Chapter content
//       language,
//     } = req.body;

//     try {
//       // Assuming you have req.user populated with the authenticated user (e.g., from JWT)
//       const author = req.user.id; // Get the user ID from the authenticated user
//       console.log('author', author);
//       // Create a new book in the database
//       const book = await Book.create({
//         name,
//         author, // Assign the authenticated user as the author
//         genre,
//         pages: parseInt(pages, 10), // Ensure pages is stored as a number
//         pageContent: JSON.parse(pageContent), // Parse chapter content JSON
//         releaseDate: new Date(), // Automatically set the release date as the current date
//         language,
//         imageUrl: req.file ? req.file.path : '', // Use uploaded image path
//       });

//       res.status(201).json({ status: 'success', data: book });
//     } catch (error) {
//       res.status(500).json({ message: 'Failed to add the book', error: error.message });
//     }
//   });
// };
const admin = require("firebase-admin");

const addBook = async (req, res) => {
  upload.single("imageUrl")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name, genre, pages, pageContent, language } = req.body;

    try {
      const author = req.user.id; // Assume authenticated user ID
      console.log("author", author);

      // Create a new book in the database
      const book = await Book.create({
        name,
        author,
        genre,
        pages: parseInt(pages, 10),
        pageContent: JSON.parse(pageContent),
        releaseDate: new Date(),
        language,
        imageUrl: req.file ? req.file.path : "",
      });

      // Fetch user tokens from the database
      const users = await Users.find({}).select("fcmToken");
      const userTokens = users.map((user) => user.fcmToken).filter((token) => !!token);
      const img= "http://192.168.1.222:5000/"+ book.imageUrl.replaceAll('\\' , "/")
      if (userTokens.length > 0) {
        // Prepare notification message
        const message = {
          notification: {
            title: `The ${name} book has been added !! `,
            body: "Check it out on our application",
          },
          android: {
            notification: {
              imageUrl: img,
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
          }, };

        // Send notification using sendMulticast
        const response = await admin.messaging().sendEachForMulticast({
          ...message,
          tokens: userTokens,
        });

        console.log(
          `Notification sent to ${response.successCount} users, failed for ${response.failureCount} users.`
        );
        
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error(`Failed to send to ${userTokens[idx]}: ${resp.error.message}`);
          }
        });
      } else {
        console.log("No tokens available to send notifications.");
      }

      res.status(201).json({ status: "success", data: book });
    } catch (error) {
      res.status(500).json({ message: "Failed to add the book", error: error.message });
    }
  });
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
    price
  } = req.body;

  try {
    const book = await Book.findByIdAndUpdate(
      id,
      {
        name,
        genre,
        pages,
        pageContent,
        releaseDate,
        language,
        imageUrl,
        price
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
const isBookBuyed = async (req, res) => {
  const { bookId , id } = req.params;
  try {
    const book = await Book.findById(bookId);
    const user = await Users.findById(id);
    book.buyers.includes(user.id) ? res.status(200).json({ status: "success", data: true }) : res.status(200).json({ status: "success", data: false });
  }catch (error) {
    res
      .status(500)
      .json({ message: "Failed to check book", error: error.message });
  }
}
const paymentClient = async (req, res) => {
  const { amount} = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    console.log('paymentIntent', paymentIntent);
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: error.message });
  }
}
const payBook = async (req, res) => {
  const { bookId , id } = req.params;
  try {
    const book = await Book.findById(bookId);
    const user = await Users.findById(id);
    if(!book || !user) {
      res.status(404).json({ status: "failed", message: "Book or User not found" });
    }
    book.buyers.push(user.id);
    book.save();
    Order.create({Book: book.id , User: user.id});
    res.status(200).json({ status: "success" });
  }
  catch (error) {
    res
      .status(500)
      .json({ message: "Failed to buy book", error: error.message });
  }
}

module.exports = {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  isBookBuyed,
  paymentClient,
  payBook,getBooksA
};
