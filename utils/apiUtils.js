const request = require("request");

async function getUserStats(user, type) {
    let url = "https://tojiru.pw/api/v1/users/";
    if (type == 1) {
        url += "rx/full";
    } else if (type == 2) {
        url += "ap/full";
    } else {
        url += "full";
    }
    url += `?id=${user}`;

    return new Promise( (resolve, reject) => {
        request.get(url, (err, req, body) => {
            if(err) reject(err);
            else {
                resolve({req, body});
            }
        })
    })

}

async function getLeaderboard(type, page, mode) {
    let url = "https://tojiru.pw/api/v1/";
    if (type == 1) {
        url += "relaxboard";
    } else if (type == 2) {
        url += "autoboard";
    } else {
        url += "leaderboard";
    }
    url += `?p=${page}&mode=${mode}`;

    return new Promise( (resolve, reject) => {
        request.get(url, (err, req, body) => {
            if(err) reject(err);
            else {
                resolve({req, body});
            }
        })
    })
}

module.exports = {
    getUserStats,
    getLeaderboard
}