var admin = require("firebase-admin");

var express = require('express');
var app     = express();
var cors    = require('cors');
var dal     = require('./dal.js');
const e = require('express');

// var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert("./serviceAccountKey.json"),
    databaseURL: 'https://courso-d392c-default-rtdb.firebaseio.com/'
});

// const defaultAuth = admin.auth();
const defaultDatabase = admin.database();
// used to serve static files from public directory
app.use(express.static('public'));
app.use(cors());

// create user account
app.get('/account/create/:name/:email/:password', function (req, res) {

    // check if account exists
    dal.find(req.params.email).
        then((users) => {

            // if user exists, return error message
            if(users.length > 0){
                console.log('User already in exists');
                res.send('User already in exists');    
            }
            else{
                // else create user
                dal.create(req.params.name,req.params.email,req.params.password).
                    then((user) => {
                        console.log(user);
                        res.send(user);            
                    });
                  
            }

        }).catch(error => console.log(error));
    admin.auth().createUser({
            email: req.params.email,
            password: req.params.password
        }
        ).then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully created new user:', userRecord.uid);
          })
          .catch((error) => {
            console.log('Error creating new user:', error);
    });
});


// login user 
app.get('/account/login/:email/:password', function (req, res) {

    dal.find(req.params.email).
        then((user) => {

            // if user exists, check password
            if(user.length > 0){
                if (user[0].password === req.params.password){
                    // res.send(user[0]);
                }
                else{
                    // res.send('Login failed: wrong password');
                }
            }
            else{
                // res.send('Login failed: user not found');
            }
    });
});

// find user account
app.get('/account/find/:email', function (req, res) {
    const idToken = req.headers.authorization;
    if (!idToken) {
        res.status(401).send();
        return
    }

    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            dal.find(req.params.email).
            then((user) => {
                console.log(user);
                res.send(user);
        }); 
        }).catch(function(error) {
            console.log('error:', error);
            res.status(401).send("Token invalid!");
        });
});

// find one user by email - alternative to find
app.get('/account/findOne/:email', function (req, res) {

    const idToken = req.headers.authorization;
    if (!idToken) {
        res.status(401).send();
        return
    }

    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            dal.findOne(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
        }); 
        }).catch(function(error) {
            console.log('error:', error);
            res.status(401).send("Token invalid!");
        });

});


// update - deposit/withdraw amount
app.get('/account/update/:email/:amount', function (req, res) {

    const idToken = req.headers.authorization;
    if (!idToken) {
        res.status(401).send();
        return
    }

    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            var amount = Number(req.params.amount);

    dal.update(req.params.email, amount).
        then((response) => {
            console.log(response);
            res.send(response);
    });    
        }).catch(function(error) {
            console.log('error:', error);
            res.status(401).send("Token invalid!");
        });

        


    
});

// all accounts
app.get('/account/all', function (req, res) {


    const idToken = req.headers.authorization;
    if (!idToken) {
        res.status(401).send();
        return
    }

    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            dal.all().
            then((docs) => {
                console.log(docs);
                res.send(docs);
        });

        }).catch(function(error) {
            console.log('error:', error);
            res.status(401).send("Token invalid!");
        });
});

var port = 8080;
app.listen(port);
console.log('Running on port: ' + port);