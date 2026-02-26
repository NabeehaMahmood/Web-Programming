const express = require('express');
const session = require('express-session');

const app = express();

// Configure session middleware
app.use(session({
    secret: "gggggghhhhhh", // Secret key for signing the session ID
    resave: false, // Prevents resaving session if nothing has changed
    saveUninitialized: false // Prevents saving uninitialized sessions
}));

app.use(express.json());


const sessionRoutes = require('./routes/sessionRoute');
app.use('/session', sessionRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});