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

app.get("/admin", async (req, res) => {
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
    res.render("base", {
        id: 100,
        title: "Admin Panel",
        loggedIn: req.isAuthenticated(),
        userData: currentUser
    });
    res.end()
})

app.get("/admin/maps", async (req, res) => {
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
    let rankRequests = await query("SELECT * FROM rank_requests INNER JOIN users ON users.id = rank_requests.userid JOIN beatmaps ON beatmaps.beatmap_id = rank_requests.bid");
    res.render("base", {
        id: 101,
        title: "Admin Panel",
        loggedIn: req.isAuthenticated(),
        userData: currentUser,
        rankRequests: rankRequests
    });
})

app.post("/admin/rank", async (req, res) => {
    if (!req.body.id) {
        res.end("No ID given.")
        return
    }
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

    await query("UPDATE beatmaps SET ranked = 2, ranked_status_freezed = 1 WHERE beatmap_id = ? LIMIT 1", req.body.id);
    let beatmapData = await query("SELECT * FROM beatmaps WHERE beatmap_id = ?", req.body.id);
    let uri = `${encodeURI(`/api/v1/fokabotMessage?k=${global.config.site.banchoApiKey}&to=#announce&msg=${currentUser} has ranked ${beatmapData[0].song_name}`)}`
    request.get(`https://c.tojiru.pw${uri}`, (err, req, body) => {
        if(err) res.end(err);
        else {
            res.end("Map Ranked");
        }
    })
})

app.post("/admin/love", async (req, res) => {
    if (!req.body.id) {
        res.end("No ID given.")
        return
    }
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

    await query("UPDATE beatmaps SET ranked = 5, ranked_status_freezed = 1 WHERE beatmap_id = ? LIMIT 1", req.body.id);
    let beatmapData = await query("SELECT * FROM beatmaps WHERE beatmap_id = ?", req.body.id);
    let uri = `${encodeURI(`/api/v1/fokabotMessage?k=${global.config.site.banchoApiKey}&to=#announce&msg=${currentUser} has ranked ${beatmapData[0].song_name}`)}`
    request.get(`https://c.tojiru.pw${uri}`, (err, req, body) => {
        if(err) res.end(err);
        else {
            res.end("Map Loved");
        }
    })
})

app.post("/admin/unrank", async (req, res) => {
    if (!req.body.id) {
        res.end("No ID given.")
        return
    }
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

    await query("UPDATE beatmaps SET ranked = 0, ranked_status_freezed = 1 WHERE beatmap_id = ? LIMIT 1", req.body.id);
    let beatmapData = await query("SELECT * FROM beatmaps WHERE beatmap_id = ?", req.body.id);
    let uri = `${encodeURI(`/api/v1/fokabotMessage?k=${global.config.site.banchoApiKey}&to=#announce&msg=${currentUser} has ranked ${beatmapData[0].song_name}`)}`
    request.get(`https://c.tojiru.pw${uri}`, (err, req, body) => {
        if(err) res.end(err);
        else {
            res.end("Map Unranked");
        }
    })
})
module.exports = app;