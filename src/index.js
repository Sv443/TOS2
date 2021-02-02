const { unused } = require("svcorelib");
const promiseAllSequential = require("promise-all-sequential");

const dbg = require("./dbg");
const error = require("./error");

const events = require("./events");
// const commands = require("./commands");

const settings = require("../settings");

const Discord = require("discord.js");



/** @type {Discord.Client} */
var client;

/**
 * Initializes everything
 */
async function initAll()
{
    try
    {
        process.stdout.write("\n\n");

        dbg("InitAll", "Initializing...");

        await preInit();
        init();
    }
    catch(err)
    {
        error("InitAll", `Error while initializing: ${err}`, "H");
    }
}

/**
 * Pre-init phase
 */
function preInit()
{
    return new Promise((pRes, pRej) => {
        unused(pRej);

        // load environment variables
        require("dotenv").config();

        return pRes();
    });
}

/**
 * Init phase - doesn't need to be waited for
 */
async function init()
{
    //#SECTION init client
    /** @type {Discord.ClientOptions} */
    const clientOptions = {
        presence: {
            activity: {
                type: "PLAYING",
                name: "with your feelings"
            },
            status: "online"
        }
    };

    dbg("Init", "Creating client...");

    client = new Discord.Client(clientOptions);

    dbg("Init", "Logging in client...");

    await client.login(process.env["BOT_TOKEN"] || "ERR_NO_TOKEN");

    events.setClient(client);


    //#SECTION init everything else
    const stages = [
        {
            name: "Registering Events",
            fn: events.init
        },
        // {
        //     name: "Registering Commands",
        //     fn: commands.init
        // }
    ];

    let promises = [];

    stages.forEach(stage => {
        promises.push(stage.fn);
    });

    dbg("Init", "Client logged in. Initializing modules...");

    try
    {
        await promiseAllSequential(promises);
        dbg("Init", "Module initialization done.");

        process.stdout.write("\n");
        console.log(`>> ${settings.info.name} (v${settings.info.version})`);
        console.log(">> Ready.");
        process.stdout.write("\n");
    }
    catch(err)
    {
        return error("Init", `Error while initializing modules: ${err}\n${err.stack}`, "H");
    }
}


module.exports = { initAll };