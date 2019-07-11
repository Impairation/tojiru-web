let standard = 0;
let taiko = 1;
let catch_the_beat = 2;
let mania = 3;

/*
    Converts a gamemode integer to be used for a database column.
*/
function get_game_mode_for_db(game_mode)
{
    let mode;
    switch(parseInt(game_mode)) 
    {
        case standard:
            mode = "std";
            break;
        case taiko:
            mode = "taiko";
            break;
        case catch_the_beat:
            mode = "ctb";
            break;
        case mania:
            mode = "mania";
        break;
        default:
            mode = "std";
    }
    return mode;
}

/*
    Converts a gamemode integer into the "official" title.
*/
function get_full_game_mode(game_mode)
{
    let mode;
    switch(parseInt(game_mode)) 
    {
        case standard:
            mode = "Standard";
            break;
        case taiko:
            mode = "Taiko";
            break;
        case catch_the_beat:
            mode = "Catch The Beat";
            break;
        case mania:
            mode = "osu!mania";
        break;
        default:
            mode = "Standard";
    }
    return mode;
}
/*
    Converts a gamemode name into one usuable for the scores table.
*/
function get_mode_number(game_mode)
{
    let mode;
    switch (game_mode) {
        case "std":
            mode = 0;
            break;
        case "taiko":
           mode = 1;
            break;
        case "ctb":
            mode = 2;
            break;
        case "mania":
            mode = 3;
            break;
        default:
            mode = 0;        
    }
    return mode;
}

module.exports = {
    get_full_game_mode,
    get_game_mode_for_db,
    get_mode_number
}