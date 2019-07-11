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

app.get("/b/:id", async (req, res) => {
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

    let beatmapId = req.params.id;
    let mainInfo = await query("SELECT * FROM beatmaps WHERE beatmap_id = ?", beatmapId);
    global.api.getBeatmaps({ s: mainInfo[0].beatmapset_id }).then(async extraInfo => {
        let scores = await query(`SELECT * FROM scores${extraAdd} INNER JOIN users_stats ON users_stats.id = scores${extraAdd}.userid WHERE beatmap_md5 = ? AND completed = 3 AND play_mode = ? LIMIT 50`, mainInfo[0].beatmap_md5, m);
        res.render("base", {
            id: 14,
            title: "Beatmap",
            loggedIn: req.isAuthenticated(),
            userData: currentUser,
            mainInfo: mainInfo[0],
            extraInfo: extraInfo,
            scores: scores,
            type: type,
            mode: m
        });
    })
})

module.exports = app;