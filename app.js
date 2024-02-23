const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { json } = require('body-parser');
require('dotenv').config();

const app = express();

// DATABASE CONNECTION
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('Database connected');
});

app.use(express.urlencoded({ extended: false }));
app.use(json());

// SESSION
app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

const userRouter = require('./Routes/route');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/', userRouter);

app.listen(3400, () => {
    console.log('Server is running on port 3400');
});
