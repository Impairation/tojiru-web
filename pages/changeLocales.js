// Create webserver
const express = require("express"),
    app = express();

app.get("/en", async (req, res) => {
    res.cookie('lang', "en");
    res.redirect("/")
})

app.get("/es", async (req, res) => {
    res.cookie('lang', "es");
    res.redirect("/")
})

app.get("/de", async (req, res) => {
    res.cookie('lang', "de");
    res.redirect("/")
})

module.exports = app;