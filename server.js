// Importing Node modules and initializing Express
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    path = require('path');

const port = process.env.PORT || 6090

// Setting up basic middleware for all Express requests
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use(function (req, res, next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// View Engine
app.set('views', path.join(__dirname, './public/'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use("/", express.static(path.join(__dirname, './public/')));
app.use("/api",express.static(path.join(__dirname, '')));

// Start the server
const server = app.listen(port, function (err)
{
    if (err) throw err;
    console.log('Your server is running on port ' + port + '.');
});

// Add the router
const router = require('./router');
router(app);
