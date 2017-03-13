const express = require('express'),
    router = express.Router(),
    imageRouter = require('./imageRoutes');

// redirect to index.html by default
router.get('/', function(req, res, next)
{
    res.render('index.html');
});

module.exports = function(app)
{
    //=========================
    // Routes
    //=========================

    // Set routes as subgroup/middleware to api Routes
    app.use('/api', imageRouter);

    // Home/Default route
    app.get('/', function(req, res)
    {
        res.render('index.html');
    });


    // Always redirect to index.html so angular 2 router will work
    app.use("/*", function(req, res) {
        res.render("index.html");
    });
};
