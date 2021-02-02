const { FolderDaemon, unused } = require("svcorelib");
const { join } = require("path");
const { readdir } = require("fs-extra");
const Discord = require("discord.js");

const dbg = require("./dbg");
const error = require("./error");

const settings = require("../settings");


unused("typedef only:", Discord);

/**
 * @typedef {function} EventExec
 * @param {Discord.Client} client The bot client
 * @param {...any[]} args Passed through arguments from the emitted event
 */

/**
 * @typedef {object} EventMeta
 * @prop {String} name The name of this event
 */

/**
 * @typedef {object} EventObj
 * @prop {string} name The name of the event file (without .js extension)
 * @prop {EventExec} exec Function to execute this event
 * @prop {EventMeta} meta Meta information about this event
 */


/** @type {Discord.Client} */
var client;

/**
 * Initializes this module
 * @returns {Promise}
 */
function init()
{
    return new Promise((pRes, pRej) => {
        // initially register the events
        dbg("Events", "Initializing...");
        register().then(() => {
            let fd = new FolderDaemon(settings.events.directory, [ "template.*" ], true, settings.events.refreshInterval);

            fd.onChanged((err, result) => {
                if(!err && result.length > 0)
                    register();
                else if(err)
                    error("Events", `Couldn't re-register events: ${err}`, "M");
            });

            return pRes();
        }).catch(err => {
            return pRej(err);
        });
    });
}

/**
 * @param {Discord.Client} cl 
 */
function setClient(cl)
{
    client = cl;
}

/**
 * Re-registers all events from the events directory
 */
function register()
{
    return new Promise((pRes, pRej) => {
        dbg("Events", "Registering events...");

        readdir(settings.events.directory, (err, files) => {
            /** @type {EventObj[]} */
            let events = [];

            if(err)
            {
                error("Events", `Couldn't read events directory at "${settings.events.directory}": ${err}`, "M");
                return pRej(err);
            }
            else if(files.length > 0)
            {
                // there are 1 or more files in the events dir
                files.forEach(evtFile => {
                    const fullPath = join(settings.events.directory, evtFile);

                    const name = evtFile.replace(/\.[a-zA-Z_]+(\n|$)/g, "");

                    /** @type {EventObj} */
                    let requiredFile = require(fullPath);

                    const { exec, meta } = requiredFile;

                    events.push({ name, exec, meta });
                });

                events.forEach(event => {
                    try
                    {
                        client.on(event.name, (...args) => {
                            event.exec(client, ...args);
                        });
                    }
                    catch(err)
                    {
                        error("Events", `Couldn't listen for event "${event.name}" on client: ${err}`, "M");
                    }
                });

                return pRes();
            }

            // if there are no events in the events dir, we just don't register any
        });
    });
}


module.exports = { init, setClient };