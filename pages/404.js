// Create webserver
const express = require("express");
const app = express();
const passport = require("passport");
passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

const apiUtils = require("../utils/apiUtils")

app.get("*", async (req, res) => {
    let currentUser = {};
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
    }
    
    res.render("base", {
        id: 10,
        title: "Page not found!",
        loggedIn: req.isAuthenticated(),
        userData:currentUser
    });
    res.end()
})

module.exports = app;