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
const app = express (); // set up the express app
const db = require(__dirname + '/models/db.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'))

app.use(session({
    secret: "very very very tight security", // your settings on how sessions be configure
    resave: true,
    saveUnitialized: false
}));

app.set('views', __dirname + '/views'); 
app.set('view engine', 'pug');

// Signup
app.get('/signup', function (request, response) {
    console.log('werkt signup.pug?')   ;
    response.render('signup')
});

// Signup Input
app.post('/signup', (request, response) => {
    bcrypt.hash(request.body.password, 8, function(err, hash) {
        if (err) { console.log(err) }
        let newUser = db.User.create({
            name: request.body.name,
            email: request.body.email,
            password: hash
        }).then( f =>{
            response.redirect('signup')
        })
    })
})

// Login
app.get('/', function (request, response) {
    response.redirect('/login');
});

app.get('/login', (request, response) => {
    console.log('werkt app.get login.pug?')
    response.render('login', {
        message: request.query.message,
        user: request.session.user
    });
});

// Login Input
app.post('/login', (request, response) => {

    //hier doe je de database query , je moet de password krijgen
   
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
			email: request.body.email // wat de user zelf invult
		}
	}).then(function (user) {
        console.log('user:')
        console.log(user)
		if (user) {
             bcrypt.compare(request.body.password, user.password, (err, result) => {
                 if(result === true){
                     console.log('////////////////////////////////////////////////////////////////////////')
                     console.log(result)
                    request.session.user = user;
			        response.redirect('/profile');
                     //in deze code block weet je dat de user nu is ingelogd
                  }
             });
			
		} else {
			response.redirect('/login?message=' + encodeURIComponent("Invalid email or password."));
		}
	}, function (error) {
		response.redirect('/login?message=' + encodeURIComponent("Invalid email or password."));
	});
});


// Logout
app.get('/logout', function (request, response) {
    console.log('werkt logout.pug?')   ;
    response.render('logout')
});

app.get('/logout', function (request, response) {
	request.session.destroy(function(error) {
		if(error) {
			throw error;
		}
		response.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});

// Homepage
app.get('/profile', function (request, response) {
    const user = request.session.user;
    if (user === undefined) {
        repsonse.redirect('/login?message=' + encodeURIComponent ("Please log in to view your profile"));
    } else {
        response.render('profile', {
            user: user
        });
    }     
});

// Create a Post page
app.get('/create_post', (request, response) => {
    console.log('werkt create_post.pug?')  
    user = request.session.user
    if (user === undefined) {
        response.redirect('/login')
    }
    else {
        response.render('create_post')
    }
});

// Post route that shows all posts people posted
app.post('/create_post', (request, response) => {
    user = request.session.user
    console.log(request.session.user)
    console.log(request.body)
    if (user === undefined) {
        response.redirect('/login')
    }
    else {
        let newMessage = db.Message.create({
            name: request.body.name,
            email:  request.body.email,
            message: request.body.message,
            userId: request.session.user.id
        }).then( f =>{
            console.log ('f is:')
            console.log(f)
            response.redirect('/all_posts')
        })
    }
})

// Own Posts page
app.get('/own_posts', (request, response) => {
    user = request.session.user
    if (user === undefined) {
        response.redirect('/login')
    }
    else {
    db.Message.findAll({
        where: {
            userId: user.id // hoe kan ik deze key gebruiken als die niet gedefined is?
        }
    }).then(messages => {
        response.render('own_posts', {allMessages: messages} )
    })
    }
    console.log('is dit userId?')
    // console.log(userId)
})

// All Posts page
app.get('/all_posts', (request, response) => {
     db.Message.findAll()
     .then(function(allPosts){
         //console.log(allPosts)
         response.render('all_posts', {allPosts : allPosts})
     })
 })

// Comment Input
app.post('/comment', (request, response) => {
    let newComment = db.Comment.create({
        comment: request.body.comment
    }).then( c =>{
        console.log ( 'c is:')
        console.log(c)
        response.send(c)
    })
})

//vb routes van gebruikers (die achter Chrome zitten)
//localhost:3000/posts/1
//localhost:3000/posts/150
//localhost:3000/posts/33
app.get('/posts/:postId', (request, response) => {
    console.log('logging :postId')
    console.log(request.params.postId)

    //get the specific post with the postId
    const postId = request.params.postId

    //get specific post with Post.findById

    response.render('specific_post', {
        someKey: "someValue"
    })
})

// Make connection with the server
app.listen(3000,() => {
    console.log('Server hast started on port 3000')
});