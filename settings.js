const { resolve } = require("path");

const packageJson = require("./package.json");


/**
 * TOS2's settings
 */
const settings = {
    debug: {
        verboseLogging: true // set to true to log debug messages to the console
    },
    info: {
        name: "TOS2",
        version: packageJson.version,
        desc: packageJson.description,
        author: packageJson.author,
        contributors: packageJson.contributors
    },
    client: {
        id: "692862284212600833" // Discord client ID of the bot user
    },
    commands: {
        directory: resolve("./commands/"), // the directory where all commands are located in
        refreshInterval: 500,              // in ms - how often commands should be checked for changes
    },
    events: {
        directory: resolve("./events/"), // the directory where all events are located in
        refreshInterval: 500,            // in ms - how often events should be checked for changes
    },
    logs: {
        directory: resolve("./logs/"), // the directory where log files should be put
    }
};

module.exports = Object.freeze(settings);