const { FolderDaemon, unused } = require("svcorelib");

const error = require("./error");

const settings = require("../settings");


/**
 * Initializes this module
 */
function init()
{
    return new Promise((pRes, pRej) => {
        // initially register the commands
        register().then(() => {
            let fd = new FolderDaemon(settings.commands.directory, [ "template.*" ], true, settings.commands.refreshInterval);

            fd.onChanged((err, result) => {
                if(!err && result.length > 0)
                    register();
                else if(err)
                    error("Commands", `Couldn't re-register commands: ${err}`, "M");
            });

            return pRes();
        }).catch(err => {
            return pRej(err);
        });
    });
}

/**
 * Re-registers all commands from the commands directory
 */
function register()
{
    return new Promise((pRes, pRej) => {

    })
}

/**
 * 
 * @param {string} name 
 * @param {string[]|number[]} args 
 */
function run(name, ...args)
{

}


module.exports = { init, run };