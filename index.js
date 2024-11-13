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
    "type": "service_account",
  "project_id": "ktebi-3c8e4",
  "private_key_id": "8884d3512690da79b2236ac1810d1a63d9aa2400",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQClvh4+BshhaOHo\nprHD3u/e8/NqTDEZotVHWgm8alDhOCRlHWst1aGPXYuy69YWp7AU7PnAua/Bhl/T\nD9Yjl703Mwx6zvMQP+p9coUzQrZ8kC1mIaqjlsH+ccAO+eIpRB4UZTCok6FsffdM\ndG2y0ccFDOvT23W8LTaN+XZEKK4xytHPIkaFopJ/D0JxVtMN8kspSDfmncnYS7CU\n0CpqlHnFuUjEZ54IGBGOzOJJ7In0KPQ6OBIabVb8dQTkyxqBLEIbpoza+K0+gsQV\n8iKfDFgHVBsZ1c1EzF6HkABZgN4Fw3e/iYYxLaiIer0uo+y6hiiWSQ5EI8Sq4zD3\nROo77C6BAgMBAAECggEAIJYJch55RRWO3OPxLVZmiMojwHFsceLe1eFw6pdogW89\nUJgBG4jV887riWjutZOQffy9edPIJ19Y9bE2Y9cQf4rM2FRZ24cFflaGs7ZZFJJw\nKpVR7EnWqEULAqbEfWKEG3Rtpaco5KC7f0+gxbiSzX5l20hZlH67LByw0OPCo80w\nDEQsvsvcEH27GtS13+3oX2Kz7UrNt2klF4yzwgr4oUBUXTU+LvNnxhDb90Y4E7MU\n6eJf8DYvwes3uGlScPRkzCJo7lsTAkFwnwSQiZuQG/OD2H7HCo1ZK7e3GcAHfs07\nqVVJRRl7ML/ID0o5y85yzz1iJYYdqE+L/nO54/q0cQKBgQC44IuYR860wyqs0hT7\niOQU0XM4hFQY2AHrgW5ptp6cRNXz7dGh45MyNjqWMTUFfWJmDI7wrVIKdsBWum03\nUUndMKIe7EBTxqs9cFlyzrsY4bstJ31LOC3T2JQ1CNAAauqUT25kHQNuNiK62lz1\nvUaOOJGWpxGB1k6phuuCABnevQKBgQDlgSGJzdbUSib91ruFDfh9kHRaZk56vLg5\n7QVM79QJU/eVqDOmbY/ssB4Rhdk06fKXOBDYa1X9Yr0NTRhkUu9VT6UZ5S7vSWGm\ntG8mx8CSs6RCIKA9rT6vD4ZWe1M+EVNs6eX0RnS6MByWZ4smeSkjzLc4nSAvWekk\nHlHPja+dFQKBgE5fMg4d8qyCR6b3b9mpkDabC6MbxaK6fyXcunep6NcJ/0DmwgVE\nufOBNZjRx05KdtoX3Mh+UNcKvEKHySC4Hv3bTf6Z3DMndxQWenTG2l2T44siwGSQ\nriyuFTXeRH7I1CSG/58FBZ1E6bgYNWwfDrfflygsLqnBtZr8DP4RGOZpAoGBANFa\nvURev7TBu9XcdwyF1QJ9rpX0M2zlEEzO+QHY2Jx1uykK2arc0OiBM7yaU6xgKMpm\n+37gUv2kf35NsI171hUFZT89AFaJowmWGLrQhsuMEa+84U/B5Kd+yvXC5Al/dpGo\nv/rX9o0NbFaLN7Ut2yhsC0sakgx/wRwQiGKEBgmNAoGAIn55BdRYUyuq1U7rhgzd\nmhoKANATZB5T/vmzbEK6iGRuIMrJm2G/mhHoEYkEnlvxuPpSs8JlntrKKA6xtde2\nrsSIWYMwl+wnrRVbxRo4Ek3YbVERBc8lEKUPFCGzIGOD3kSPC5PLc3+b42sf8iGh\nTtntmT6Fs3p+7bSlM8TuQTc=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-6m087@ktebi-3c8e4.iam.gserviceaccount.com",
  "client_id": "115543213627666780268",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6m087%40ktebi-3c8e4.iam.gserviceaccount.com",
  "universe_domain":  "googleapis.com"
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
