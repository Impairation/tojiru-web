// Create webserver
const express = require("express");
const app = express();
const md5 = require("md5");
const passwordUtils = require("../utils/passwordUtils")
const { query } = require("../db")
const passport = require("passport");
passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

app.get("/login", async (req, res) => {
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
        id: 8,
        title: "Login",
        loggedIn: req.isAuthenticated(),
        userData: currentUser,
        error: req.query.e,
        
    });
})

app.post("/login", async (req, res) => {
    let username = req.body.username;
    let password = md5(req.body.password);
    let q = await query("SELECT * FROM users WHERE username = ?", username);

    let passwordCheck = await passwordUtils.comparePassword(password, q[0].password_md5);
    if (passwordCheck) {
        let uid = q[0].id;
        req.login(uid, function () {
            res.redirect("/");
        });

    } {
        res.redirect("/login?e=Password doesn't match")
    }
    res.end()
})

module.exports = app;