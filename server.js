const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
require('./config/passport'); // Passport Config
const movieRoutes = require('./routes/movieRoutes'); // Thêm route movies
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const theaterRoutes = require('./routes/theaterRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000',
        'http://localhost:5000',
        'http://localhost:5173'
    ],
    credentials: true
}));


app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use((req, res, next) => {
    res.removeHeader("Cross-Origin-Opener-Policy");
    res.removeHeader("Cross-Origin-Embedder-Policy");
    next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes, movieRoutes, showtimeRoutes, theaterRoutes, bookingRoutes);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
