// Create webserver
const express = require("express");
const app = express();
const apiUtils = require("../utils/apiUtils")
const modeNames = require("../utils/dbUtils")
const { query } = require("../db");
const passport = require("passport");
passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

app.get("/leaderboard/:type", async (req, res) => {
    var lbType = req.params.type;
    let page = req.query.p;
    if (page != undefined) {
        page = page + 1
    } else {
        page = 1
    }
    let mode = req.query.m;
    if (mode == undefined) {
        mode = 0;
    }
    let lbInt;
    if (lbType == "performance") {
        lbInt = 0;
    } else if (lbType == "relax") {
        lbInt = 1;
    } else if (lbType == "autopilot") {
        lbInt = 2;
    } else {
        lbInt = 0
    }

    let lb = await apiUtils.getLeaderboard(lbInt, page, mode);
    let lbJson = JSON.parse(lb.body);
    let leaderboard = lbJson.users

    let modeName = modeNames.get_full_game_mode(mode);
    let currentUser = {};
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
    }
    res.render("base", {
        id: 3,
        title: "Leaderboard",
        leaderboard: leaderboard,
        modeName: modeName,
        type: "performance",
        loggedIn: req.isAuthenticated(),
        userData: currentUser,
        lbType: lbType
    });
    res.end()
})

app.get("/leaderboard/score", async (req, res) => {
    let page = req.query.p;
    if (page != undefined) {
        page = page + 1
    } else {
        page = 1
    }
    let mode = req.query.m;
    if (mode == undefined) {
        mode = 0;
    }

    let lb = await query(`SELECT username, ranked_score_${modeNames.get_game_mode_for_db(mode)} AS score FROM users_stats ORDER BY ranked_score_${modeNames.get_game_mode_for_db(mode)} DESC`);
    let leaderboard = [];
    let i = 1;
    lb.forEach(user => {
        let obj = {
            rank: i,
            username: user.username,
            score: user.score
        }
        leaderboard.push(obj);
        i++
    })

    let modeName = modeNames.get_full_game_mode(mode);
    let currentUser = {};
    let userId = 0;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)
    }
    res.render("base", {
        id: 4,
        title: "Leaderboard",
        leaderboard: leaderboard,
        modeName: modeName,
        loggedIn: req.isAuthenticated(),
        userData: currentUser
    });
    res.end()
})


module.exports = app;