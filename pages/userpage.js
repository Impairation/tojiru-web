// Create webserver
const express = require("express");
const app = express();
const apiUtils = require("../utils/apiUtils")
const { query } = require("../db")
const modUtils = require("../utils/modUtils")
const passport = require("passport");


passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

app.get("/u/:id", async (req, res) => {
    var id;
    let userdata;
    let type = req.query.type;
    let extraQuery;
    let currentUser = {};
    let userId = 0;
    let canSeePanel = false;
    if (req.user) {
        userId = req.user;
        currentUser = await apiUtils.getUserStats(userId, 0)
        currentUser = JSON.parse(currentUser.body)

    }

    if (isNaN(req.params.id)) {
        let idQuery = await query("SELECT * FROM users WHERE username = ?", req.params.id);
        if (!idQuery || !idQuery.length) {
            res.render("base", {
                id: 9,
                title: "User Not Found",
                loggedIn: req.isAuthenticated(),
                userData: currentUser,

            })
        }
        id = idQuery[0].id
    } else {
        id = req.params.id
    }

    if (type == "relax") {
        userdata = await apiUtils.getUserStats(id, 1)
        extraQuery = "_relax";
    } else if (type == "autopilot") {
        userdata = await apiUtils.getUserStats(id, 2);
        extraQuery = "_auto"
    } else {
        userdata = await apiUtils.getUserStats(id, 0);
        extraQuery = ""
    }
    let data = JSON.parse(userdata.body);
    let q = await query("SELECT * FROM users_stats WHERE id = ?", id);
    if (data.code == 404) {
        res.render("base", {
            id: 9,
            title: "User Not Found",
            loggedIn: req.isAuthenticated(),
            userData: currentUser,

        })
        res.end()
    }
    let mode = req.query.m;
    let userData;
    if (mode == 0 || mode == undefined) {
        userData = {
            id: data.id,
            username: data.username,
            rank: data.std.global_leaderboard_rank,
            pp: data.std.pp,
            userpage: q[0].userpage_content,
            total_score: data.std.total_score,
            ranked_score: data.std.ranked_score,
            level: data.std.level.toFixed(2)
        }
    } else if (mode == 1) {
        userData = {
            id: data.id,
            username: data.username,
            rank: data.taiko.global_leaderboard_rank,
            pp: data.taiko.pp,
            userpage: q[0].userpage_content,
            total_score: data.taiko.total_score,
            ranked_score: data.taiko.ranked_score,
            level: data.taiko.level.toFixed(2)
        }
    } else if (mode == 2) {
        userData = {
            id: data.id,
            username: data.username,
            rank: data.ctb.global_leaderboard_rank,
            pp: data.ctb.pp,
            userpage: q[0].userpage_content,
            total_score: data.ctb.total_score,
            ranked_score: data.ctb.ranked_score,
            level: data.ctb.level.toFixed(2)
        }
    } else if (mode == 3) {
        userData = {
            id: data.id,
            username: data.username,
            rank: data.mania.global_leaderboard_rank,
            pp: data.mania.pp,
            userpage: q[0].userpage_content,
            total_score: data.mania.total_score,
            ranked_score: data.mania.ranked_score,
            level: data.mania.level.toFixed(2)
        }
    } else {
        userData = {
            id: data.id,
            username: data.username,
            rank: data.std.global_leaderboard_rank,
            pp: data.std.pp,
            userpage: q[0].userpage_content,
            total_score: data.std.total_score,
            ranked_score: data.std.ranked_score,
            level: data.std.level.toFixed(2)
        }
    }
    let extraAdd;
    if (type == "relax") {
        extraAdd = "&type=relax"
    } else if (type == "autopilot") {
        extraAdd = "&type=autopilot"
    } else {
        extraAdd = "&type=vanilla"
    }
    if (mode == undefined) {
        mode = 0
    }
    let mostRecentPlay = await query(`SELECT * FROM scores${extraQuery} INNER JOIN beatmaps ON scores${extraQuery}.beatmap_md5 = beatmaps.beatmap_md5 WHERE userid = ? AND play_mode = ${mode} ORDER BY scores${extraQuery}.id DESC LIMIT 1`, id)
    let topScoresQuery = await query(`SELECT * FROM scores${extraQuery} INNER JOIN beatmaps ON scores${extraQuery}.beatmap_md5 = beatmaps.beatmap_md5 WHERE userid = ? AND completed = 3 AND play_mode = ${mode} ORDER BY scores${extraQuery}.pp DESC LIMIT 10`, id)
    let recentScoresQuery = await query(`SELECT * FROM scores${extraQuery} INNER JOIN beatmaps ON scores${extraQuery}.beatmap_md5 = beatmaps.beatmap_md5 WHERE userid = ? AND play_mode = ${mode} ORDER BY scores${extraQuery}.id DESC LIMIT 10`, id)
    let topScores = [];
    let recentScores = [];
    topScoresQuery.forEach(score => {
        let obj = {
            song_name: score.song_name,
            accuracy: score.accuracy,
            pp: score.pp,
            mods: modUtils.stringify_mods(score.mods)
        }
        topScores.push(obj)
    });

    recentScoresQuery.forEach(score => {
        let obj = {
            song_name: score.song_name,
            accuracy: score.accuracy,
            pp: score.pp,
            mods: modUtils.stringify_mods(score.mods)
        }
        recentScores.push(obj)
    });
    let group = await query("SELECT * FROM privileges_groups WHERE privileges = ?", data.privileges);

    res.render("base", {
        id: 5,
        title: "Userpage",
        requestedData: userData,
        extraInfo: q[0],
        extraAdd: extraAdd,
        mostRecentPlay: mostRecentPlay,
        topScores: topScores,
        recentScores: recentScores,
        loggedIn: req.isAuthenticated(),
        userData: currentUser,
        userGroup: group[0]
    });
    res.end()
})

module.exports = app;