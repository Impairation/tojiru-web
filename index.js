// Create webserver
const express = require("express");
const app = express();

const scheduler = require("./utils/timer");
const bodyParser = require('body-parser');
const path = require("path")
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const api = require('node-osu');


// Set the global variables
global.server = app;
global.version = "0.0.1"
global.handledRequests = 0;
global.requestsLastSecond = 0;
global.config = require("./config.json")
global.api = new api.Api(global.config.osu.api_key)

// Extra middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

// Request counter middleware™
app.use("*", function (req, res, next) {
    global.handledRequests++;
    global.requestsLastSecond++;

    next();
});

app.use(cookieParser());
app.use(fileUpload());
app.use(session({
    secret: config.site.secret,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());



// Set up scheduler jobs
scheduler.every("reset 'request per second'", "one second", function () {
    global.requestsLastSecond = 0;
});

scheduler.start();

app.use(require("./pages/home"))
app.use(require("./pages/register"))
app.use(require("./pages/verify"))
app.use(require("./pages/leaderboard"))
app.use(require("./pages/userpage"))
app.use(require("./pages/about"))
app.use(require("./pages/rules"))
app.use(require("./pages/login"))
app.use(require("./pages/adminBetaKeys"))
app.use(require("./pages/beatmaps"))
app.use(require("./pages/topScores"))
app.use(require("./pages/beatmapPage"))
app.use(require("./pages/admin"))
app.use(require("./pages/adminUsers"))

app.get('/logout', async (req, res) => { 
    let uid = req.user;
    req.logout(uid);
    res.redirect("/")
})

app.use(require("./pages/404"))
app.listen(global.config.site.port, function () {
    console.log("App is running on http://127.0.0.1:%d", global.config.site.port);
});