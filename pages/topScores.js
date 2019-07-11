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

app.get("/top", async (req, res) => {
    let currentUser = {};
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
    }
    let type = req.query.type;
    let extraAdd;
    if (type == 0) {
        extraAdd = "";
    } else if (type == 1) {
        extraAdd = "_relax";
    } else if (type == 2) {
        extraAdd = "_auto";
    } else {
        extraAdd = "";
        type == 0
    }

    let mode = req.query.m;
    let m;
    if (mode == 0) {
        m = 0;
    } else if (mode == 1) {
        m = 1;
    } else if (mode == 2) {
        m = 2;
    } else if (mode == 3) {
        m = 3
    } else {
        m = 0;
    }
    let q = `SELECT * FROM scores${extraAdd} INNER JOIN beatmaps ON scores${extraAdd}.beatmap_md5 = beatmaps.beatmap_md5 JOIN users ON users.id = scores${extraAdd}.userid WHERE scores${extraAdd}.completed = 3 AND play_mode = ${m} ORDER by scores${extraAdd}.pp DESC LIMIT 100`;
    let scores = await query(q);

    res.render("base", {
        id: 12,
        title: "Top Scores",
        loggedIn: req.isAuthenticated(),
        userData:currentUser,
        topScores: scores,
        mode: m,
        type: type
    });
    res.end()
})

module.exports = app;