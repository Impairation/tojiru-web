// Create webserver
const express = require("express");
const app = express();
const passport = require("passport");
const { query } = require("../db")
passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

const apiUtils = require("../utils/apiUtils")

app.get("/admin/keys", async (req, res) => {
    let currentUser = { privileges: 3 };
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
    }

    let group = await query("SELECT * FROM privileges_groups WHERE privileges = ?", currentUser.privileges);
    if (group[0].id != 4 && group[0].id != 7) {
        res.render("base", {
            id: 15,
            title: "404",
            loggedIn: req.isAuthenticated(),
            userData: currentUser
        });
        return
    }

    let keys = await query("SELECT * FROM beta_keys ORDER BY id DESC")
    res.render("base", {
        id: 110,
        title: "Admin Keys",
        loggedIn: req.isAuthenticated(),
        userData: currentUser,
        keys: keys
    });
})

app.get("/generate", async (req, res) => {
    let currentUser = { privileges: 3 };
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
    }

    let group = await query("SELECT * FROM privileges_groups WHERE privileges = ?", currentUser.privileges);
    if (group[0].id != 4 && group[0].id != 7) {
        res.render("base", {
            id: 15,
            title: "404",
            loggedIn: req.isAuthenticated(),
            userData: currentUser
        });
        return
    }
    let k = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await query("INSERT INTO beta_keys(code, allowed) VALUES(?,1)", k);
    res.redirect("/admin/keys");
})

app.get("/generate/public", async (req, res) => {
    let currentUser = { privileges: 3 };
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
    }

    let group = await query("SELECT * FROM privileges_groups WHERE privileges = ?", currentUser.privileges);
    if (group[0].id != 4 && group[0].id != 7) {
        res.render("base", {
            id: 15,
            title: "404",
            loggedIn: req.isAuthenticated(),
            userData: currentUser
        });
        return
    }
    let k = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await query("INSERT INTO beta_keys(code, allowed, public) VALUES(?,1,1)", k);
    res.redirect("/admin/keys");
})

app.get("/keys", async (req, res) => {
    let currentUser = { privileges: 3 };
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
    }
    let keys = await query("SELECT * FROM beta_keys WHERE public = 1 ORDER BY id DESC")
    res.render("base", {
        id: 13,
        title: "Public Keys",
        loggedIn: req.isAuthenticated(),
        userData: currentUser,
        keys: keys
    });
})
module.exports = app;