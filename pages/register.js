// Create webserver
const express = require("express");
const app = express();
const { query } = require("../db")
const passwordUtils = require("../utils/passwordUtils")
const md5 = require("md5")
const passport = require("passport");
const apiUtils = require("../utils/apiUtils")

passport.serializeUser(function (uid, done) {
    done(null, uid);
});

passport.deserializeUser(function (uid, done) {
    done(null, uid);
});

app.get("/register", async (req, res) => {
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
        id: 1,
        title: "Register",
        error: req.query.e,
        loggedIn: req.isAuthenticated(),
        userData: currentUser,
        
    });
    res.end()
})

app.post("/register", async (req, res) => {
    let bad_usernames = ['peppy', 'rrtyui', 'cookiezi', 'azer', 'loctav', 'banchobot', 'happystick', 'doomsday', 'sharingan33', 'andrea', 'cptnxn', 'reimu-desu', 'hvick225', '_index', 'my aim sucks', 'kynan', 'rafis', 'sayonara-bye', 'thelewa', 'wubwoofwolf', 'millhioref', 'tom94', 'tillerino', 'clsw', 'spectator', 'exgon', 'axarious', 'angelsim', 'recia', 'nara', 'emperorpenguin83', 'bikko', 'xilver', 'vettel', 'kuu01', '_yu68', 'tasuke912', 'dusk', 'ttobas', 'velperk', 'jakads', 'jhlee0133', 'abcdullah', 'yuko-', 'entozer', 'hdhr', 'ekoro', 'snowwhite', 'osuplayer111', 'musty', 'nero', 'elysion', 'ztrot', 'koreapenguin', 'fort', 'asphyxia', 'niko', 'shigetora'];
    let n = bad_usernames.includes(req.body.username);
    if (n) {
        res.redirect("/register?e=Username isn't allowed.");
        res.end()
        return
    }
    if (req.body.password != req.body.confirm) {
        res.redirect("/register?e=Passwords dont match")
        res.end()
        return
    }
    if (req.body.password == "" || req.body.confirm == "") {
        res.redirect("/register?e=Password can't be blank")
        res.end()
        return
    }
    if (req.body.email == "") {
        res.redirect("/register?e=Email can't be black")
        res.end()
        return
    }
    let safe_username = req.body.username.toLowerCase().replace(" ", "_").replace(/[^\x00-\x7F]/g, "");
    if (safe_username.length < 2 || req.body.username.length < 3) {
        res.redirect("/register?e=Asian usernames are currently not allowed, neither are usernames less than 2 characters long.")
        res.end()
        return
    }
    let username_check = await query("SELECT * FROM users WHERE username = ?", req.body.username)
    let email_check = await query("SELECT * FROM users WHERE email = ?", req.body.email)

    if (username_check.length > 0) {
        res.redirect("/register?e=The username you wanted is currently in use, sorry.")
        res.end()
        return
    }

    if (email_check.length > 0) {
        res.redirect(`/register?e=Hey, don't try to register again, ${email_check[0].username}`);
        res.end()
        return
    }

    let key = await query("SELECT * FROM beta_keys WHERE code = ? AND allowed = 1", req.body.key);
    if (key.length > 0) {
        let password = await passwordUtils.hashPassword(md5(req.body.password))
        await query("INSERT INTO users(username,username_safe,password_md5,salt,email,register_datetime,privileges,password_version) VALUES(?,?,?,' ',?,?,?,2)", req.body.username, safe_username, password, req.body.email, Math.floor(Date.now() / 1000), 2);
        await query("INSERT INTO `users_stats`(username, user_color, user_style, ranked_score_std, playcount_std, total_score_std, ranked_score_taiko, playcount_taiko, total_score_taiko, ranked_score_ctb, playcount_ctb, total_score_ctb, ranked_score_mania, playcount_mania, total_score_mania) VALUES (?, 'black', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)", req.body.username)
        await query("UPDATE beta_keys SET allowed = 0 WHERE code = ?", req.body.key);

        res.redirect("/verify")
    } else {
        res.redirect("/register?e=Invalid Key")
    }
})

module.exports = app;