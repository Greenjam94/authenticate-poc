require('dotenv').config()
const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');


const saltRounds = 10;
const PORT = process.env.NODE_DOCKER_PORT || 8080;

const dbConfig = require("./config/db.js");
const connection = mysql.createConnection({
  host     : dbConfig.HOST,
  user     : dbConfig.USER,
  password : dbConfig.PASSWORD,
  database : dbConfig.DB
});

//initialize express
const app = express();

//associated modules for express
app.use(session({
  secret: process.env.APP_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// ROUTES

/*
 /         login form
 /signup   sign up form
 /register register action
 /auth     login action
 /home     view user page
 */

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/signup', function(request, response) {
  response.sendFile(path.join(__dirname + '/signup.html'));
});

app.post('/register', function(request, response) {
  // Capture the input fields
  let email = request.body.email;
  let password = request.body.password;
  let name = request.body.name;
  let data = request.body.data;

  //compare provided passwords
  if(request.body.password2 !== request.body.password) {
    response.send('Password did not match both times');
    response.end();
  }
  else if (email && password) {

    bcrypt.hash(password, saltRounds, (err, hash) => {
      // store the hash in db.
      connection.query('INSERT INTO user (email, hash) VALUES (?, ?)', [email, hash], function(error, results, fields) {
        if (error) throw error;
      });
    });

    // log in after signing up
    request.session.loggedin = true;
    request.session.email = email;

    response.redirect('/home');
    response.end();

  } else {
    response.send('Please complete the sign up form');
    response.end();
  }
});

app.post('/auth', function(request, response) {
  // Capture the input fields
  let email = request.body.email;
  let password = request.body.password;

  // Ensure the input fields exist
  if (email && password) {
    // Execute SQL query that will select the account from the database based on the specified email and password
    connection.query('SELECT * FROM user WHERE email = ? limit 1', [email], function(error, results, fields) {
      if (error) throw error;

      // compare the db hash value with the hash of the provided password, error if not a match
      bcrypt.compare(password, results[0]['hash'], function(err, res) {
        if (err) throw error;
      });

      // else valid password so authenticate the user
      request.session.loggedin = true;
      request.session.email = email;

      response.redirect('/home');
      response.end();
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});

app.get('/home', function(request, response) {
  // If the user is loggedin
  if (request.session.loggedin) {
    // Output username
    response.send('Welcome back, ' + request.session.email + '!');
  } else {
    // Not logged in
    response.send('Please login to view this page!');
  }
  response.end();
});

app.listen(PORT, () => {
  console.log(`Server is running...`);
});