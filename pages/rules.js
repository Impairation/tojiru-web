// Create webserver
const express = require("express");
const app = express();
const passport = require("passport");
const apiUtils = require("../utils/apiUtils")
passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

app.get("/rules", async (req, res) => {
    let currentUser = {};
    let userId = 0;
    let canSeePanel = false;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
        
    }
    res.render("base", {
        id: 7,
        title: "Rules",
        loggedIn: req.isAuthenticated(),
        userData: currentUser,
        
    });
    res.end()
})

module.exports = app;