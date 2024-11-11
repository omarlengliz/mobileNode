const express = require('express');
const connectDB = require('./config/connectDb');
var cors = require('cors')
const userRoutes = require('./routes/UserRoutes');
const genreRoutes = require('./routes/GenreRoutes');
const bookRoutes = require('./routes/BookRoutes');
const statsRoutes = require('./routes/statsRoutes');
const ratingRoutes = require('./routes/RatingRoutes');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB()
const admin = require('firebase-admin');
const serviceAccount = require('./service.json');
const firebaseConfig = {
  apiKey: "AIzaSyAGDb7df3HLeoOuySAM2L-qd3YtaapDRMo",
  authDomain: "ktebi-3c8e4.firebaseapp.com",
  projectId: "ktebi-3c8e4",
  storageBucket: "ktebi-3c8e4.firebasestorage.app",
  messagingSenderId: "184847981670",
  appId: "1:184847981670:web:a5a67727edd47fea9fa1a7"
};

// Initialize Firebase
 initializeApp(firebaseConfig);
app.use('/uploads', express.static('uploads'));
app.use(cors(
  {
    origin: '*'
  }
))

app.use("/api/users" , userRoutes)
app.use("/api/genres" , genreRoutes)
app.use("/api/books" , bookRoutes)
app.use("/api/stats" , statsRoutes )
app.use("/api/ratings" , ratingRoutes) 
 const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is  running on port ${PORT}`);
});
