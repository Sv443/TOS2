const { colors, unused } = require("svcorelib");
const fs = require("fs-extra");

const col = colors.fg;

/**
 * Logs an error to the console (severity L+), file system (severity M+) or crashes the system (severity H)
 * @param {String} where Where this error occurred
 * @param {String|Error} what What is the error?
 * @param {"H"|"M"|"L"} [severity] `H`igh, `M`edium or `L`ow - defaults to "M"
 */
function error(where, what, severity)
{
    severity = severity.toUpperCase();

    if(severity.length !== 1 || !["H", "M", "L"].includes(severity))
        severity = "M";


    let whatStr = "";

    if(what instanceof Error)
        whatStr = `${what.message}\n${what.stack}`;
    else if(typeof what === "string")
        whatStr = what;
    else
        throw new TypeError(`Parameter "what" was not provided`);

    if(typeof where !== "string")
        throw new TypeError(`Parameter "what" was not provided`);

    
    const severityStringMapping = {
        "H": "HIGH",
        "M": "Medium",
        "L": "Low"
    };

    const severityBracketColorMapping = {
        "H": col.red,
        "M": col.magenta,
        "L": col.yellow
    };

    const severityString = severityStringMapping[severity] || "M";
    const bracketCol = severityBracketColorMapping[severity] || col.magenta;

    
    console.log(`${col.red}${bracketCol}[${severityString} Severity Error/${col.rst}${col.blue}${where}${bracketCol}]: ${col.rst}${whatStr}`);


    switch(severity)
    {
        case "H":
            writeToLog(`Error_severity${severityString}.log`, where, what).then(() => {
                process.exit(1);
            }).catch(err => {
                unused(err);
                process.exit(1);
            });
        break;
        case "M":
            writeToLog(`Error_severity${severityString}.log`, where, what);
        break;
        case "L":
            unused();
        break;
    }
}

/**
 * Writes an error to a log file
 * @param {string} fileName 
 * @param {string} where 
 * @param {string} what 
 * @returns {Promise}
 */
function writeToLog(fileName, where, what)
{
    return new Promise((pRes, pRej) => {

    });
}

module.exports = error;