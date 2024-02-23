const express = require('express');
const router = express.Router();
const user = require("../models/user");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single('image');

router.post('/add', upload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded', type: 'danger' });
        }

        const newUser = new user({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });

        await newUser.save();
        console.log('User added successfully:', newUser);

        res.json({ message: 'User added successfully', type: 'success' });
        res.redirect('/');
    } catch (err) {
        console.error('Error adding user:', err);
        res.json({ message: err.message, type: 'danger' });
    }
});

router.get('/home', (req, res) => {
    res.render('index');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/add', (req, res) => {
    res.render('adduser');
});

module.exports = router;
