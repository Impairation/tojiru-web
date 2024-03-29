// Initial Imports
const express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    path = require("path"),
    cookieParser = require("cookie-parser"),
    session = require('express-session'),
    passport = require('passport'),
    fileUpload = require('express-fileupload'),
    api = require('node-osu'),
    fs = require("fs");

if (!fs.existsSync('config.json')) {
    fs.createReadStream('config.sample.json').pipe(fs.createWriteStream('config.json'));
    console.log("No config file was found, we have created one for you.");
    setTimeout(() => {
        process.exit(0)
    }, 500);
} else {
    // Set the global variables
    global.config = require("./config.json")
    global.api = new api.Api(global.config.osu.api_key)

    // Middleware
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use('/static', express.static(path.join(__dirname, 'static')));
    app.use(cookieParser());
    app.use(fileUpload());
    app.use(session({
        secret: config.site.secret,
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(require("./utils/localeUtils"));

    app.use(require("./pages/changeLocales"))
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
}
