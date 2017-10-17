const path  = require('path');
const fs    = require('fs');
const toPAC = require('../index.js');
const yargs = require('yargs');

const VERSION = require('../package.json').version;

return yargs
    .usage('$0 <source> <destination>')
    .command(['* <source> <destination>', ' <source> <destination>'], 'Converts jpg/png file to pac/paa DXT5 compressed image', {
    }, command)
    .version('version', 'Prints library version tag', VERSION)
    .alias('v', 'version')
    .strict(true)
    .help('h', false)
    .alias('h', 'help')
    .wrap(yargs.terminalWidth())
    .argv;


/**
 * @param {Object} argv
 * @return {Promise}
 */
function command(argv) {
    let source = argv.source;
    let dest = argv.destination;

    if (!path.isAbsolute(source)) {
        source = path.resolve(process.cwd() + '/' + source);
    }

    try {
        let stat = fs.statSync(argv.destination);
        if (stat.isDirectory()) {
            dest = path.resolve(dest + '/' + path.parse(source).name + '.pac');
        }
    } catch(e) {
        if (e.code !== 'ENOENT') {
            return error(e);
        }
    }

    return toPAC(source, dest).catch(error);
}

function error(e) {
    console.error(e);
    process.exit(1);
}
