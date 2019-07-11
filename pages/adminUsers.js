// Create webserver
const express = require("express");
const app = express();
const passport = require("passport");
const { query } = require("../db")
const request = require("request")

passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

const apiUtils = require("../utils/apiUtils")

app.get("/admin/users", async (req, res) => {
    let currentUser = { privileges: 3 };
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
    }
    if (currentUser.privileges < 267) {
        res.render("base", {
            id: 15,
            title: "404",
            loggedIn: req.isAuthenticated(),
            userData: currentUser
        });
    }
    let page = req.query.p;
    let offset;
    if (page != undefined || page > 0) {
        offset = "OFFSET " + 50 * page;
    } else {
        offset = "0";
    }

    let users = await query(`SELECT users.id, users.username, privileges_groups.privileges, privileges_groups.name FROM users INNER JOIN privileges_groups ON users.privileges = privileges_groups.privileges LIMIT 50 OFFSET ${offset}`)

    res.render("base", {
        id: 102,
        title: "Admin User List",
        loggedIn: req.isAuthenticated(),
        userData: currentUser,
        userList: users
    });
    res.end()
})
module.exports = app;