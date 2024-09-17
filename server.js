const express = require('express');
const app = express();
const hbs = require('hbs');
const nocache = require('nocache');
const session = require('express-session');

// Mock credentials
const username = 'a@gmail.com';
const password = 'a';
// const user = [
//     {email : 'a@gmail.com', pass : 'a'},
//     {email : 'b@gmail.com', pass : 'b'},


// ]
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(nocache());
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if you're using HTTPS
}));

app.set('view engine', 'hbs');
app.set('views', './views'); // Ensure this path matches where your views are located

// Routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/home'); // Redirect to /home if user is logged in
    } else {
         req.session.passwordwrong = false; // Reset passwordwrong flag
        const msg = req.session.passwordwrong ? 'Invalid credentials' : null;
       
        res.render('login', { msg });
    }
});

app.post('/verify', (req, res) => {
    const { email, password : pass } = req.body;

    console.log(req.body);

    if (email === username && pass === password) {
        req.session.user = email;
        res.redirect('/home');
    } else {
        req.session.passwordwrong = true;
        //res.redirect('/');
        res.render('login', { msg:'Invalid credentials' });
        

    }
});

app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home');
    } else {
        const msg = req.session.passwordwrong ? 'Invalid credentials' : null;
        req.session.passwordwrong = false; // Reset flag
        res.render('login', { msg });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/home'); // Redirect to login page after logout
    });
});

app.listen(3003, () => console.log('Server running on http://localhost:3003'));
