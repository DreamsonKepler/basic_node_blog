// Create a blogging application that allows users to do the following:
    // - register an account
    // - login
    // - logout

// Once logged in, a user should be able to:
    // - create a post
    // - view a list of their own posts
    // - view a list of everyone's posts
    // - view a specific post, including the comments people have made about it
    // - leave a comment on a post

const express = require('express');
const app = express ();
const db = require(__dirname + '/models/db.js')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'))

app.set('views', __dirname + '/views'); 
app.set('view engine', 'pug');

app.get('/', (request, response) => {
    response.send('heya')
});

app.listen(3000);    