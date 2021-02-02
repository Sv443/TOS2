const scl = require("svcorelib");

const settings = require("../settings");
const col = scl.colors.fg;


/**
 * Logs a message to the console if `settings.debug.verboseLogging` is set to true
 * @param {string} where 
 * @param {string} what 
 */
function dbg(where, what)
{
    settings.debug.verboseLogging && console.log(`* ${col.yellow}[DBG/${col.blue}${where}${col.yellow}] - ${col.rst}${what}`);
}

module.exports = dbg;