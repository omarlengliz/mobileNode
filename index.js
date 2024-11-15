const express = require('express');
const connectDB = require('./config/connectDb');
var cors = require('cors')
const userRoutes = require('./routes/UserRoutes');
const genreRoutes = require('./routes/GenreRoutes');
const bookRoutes = require('./routes/BookRoutes');
const statsRoutes = require('./routes/statsRoutes');
const ratingRoutes = require('./routes/RatingRoutes');
const path= require("path")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB()
const admin = require('firebase-admin');
const serviceAccount = require('./service.json');
console.log(serviceAccount)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
console.log(path.join(__dirname, 'uploads'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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
