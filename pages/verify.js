// Create webserver
const express = require("express");
const app = express();
const { query } = require("../db")
const passport = require("passport");
const apiUtils = require("../utils/apiUtils");

passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

app.get("/verify", async (req, res) => {
    if (req.user) {
        res.redirect("/");
    }
    let currentUser = {};
    let userId = 0;
    let canSeePanel = false;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
        
    }
    res.render("base", {
        id: 2,
        title: "Verify your account",
        loggedIn: req.isAuthenticated(),
        userData: currentUser,
        
    });
    res.end()
})

module.exports = app;