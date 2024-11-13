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
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  })
});
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
