const Discord = require("discord.js");



/** @type {events.EventMeta} */
const meta = {
    name: "message"
};

/** @type {events.EventExec} */
function exec(client, ...args)
{
    console.log(args);
}

module.exports = { meta, exec };