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




const pg = require('pg');
const express = require('express');
const app = express ();
const db = require(__dirname + '/models/db.js');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'))

app.use(session({
    secret: "very very very tight security", // your settings on how sessions be configure
    resave: true,
    saveUnitialized: false
}));

app.set('views', __dirname + '/views'); 
app.set('view engine', 'pug');

app.get('/login', (request, response) => {
    console.log('werkt app.get login.pug?')
    response.render('login', {
        message: request.query.message,
        user: request.session.user
    });
});

app.get('/profile', function (request, response) {
    const user = request.session.user;
    if (user === undefined) {
        repsonse.redirect('/?message=' + encodeURIComponent ("Please log in to view your profile"));
    } else {
        response.render('profile', {
            user: user
        });
    }     
});


app.post('/login', (request, response) => {
    console.log('request body email:')
    console.log(request.body.email)
    console.log('request body password')
    console.log(request.body.password)
    if(request.body.email.length === 0) {
        response.redirect('/login?message=' + encodeURIComponent("Please fill out your email address."));
        return;
    }
    if(request.body.password.length === 0) {
		response.redirect('/login?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}
	db.User.findOne({
		where: {
			email: request.body.email
		}
	}).then(function (user) {
        console.log('user:')
        console.log(user)
		if (user !== null && request.body.password === user.password) {
			request.session.user = user;
			response.redirect('/profile');
		} else {
			response.redirect('/login?message=' + encodeURIComponent("Invalid email or password."));
		}
	}, function (error) {
		response.redirect('/login?message=' + encodeURIComponent("Invalid email or password."));
	});
});

app.post('/signup', (request, response) => {
    console.log(request.body)
    let newUser = db.User.create({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
    }).then( f =>{
        console.log (f)
        response.redirect('/signup_succesful')
    })
})


app.get('/logout', function (request, response) {
	request.session.destroy(function(error) {
		if(error) {
			throw error;
		}
		response.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});

app.listen(3000,() => {
    console.log('Server hast started on port 3000')
});