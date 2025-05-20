const express = require('express');
const ejsLayout = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

// Create an Express application
const app = express();
const hostname = '127.0.0.1';
const port = 3007;

// Set the layout
app.use(ejsLayout);

// Set the views directory
app.set('views', './views');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'sinra tensei',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}))

// Define routes
const studentRouter = require('./routers/studentRouter');
const subjectRouter = require('./routers/subjectRouter');
const registerRouter = require('./routers/registerRouter');

app.use('/', studentRouter);
app.use('/subject', subjectRouter);
app.use('/register', registerRouter);

// Start the server
app.listen(port, hostname, () => {
    console.log(`Running on port http://${hostname}:${port}`);
});
