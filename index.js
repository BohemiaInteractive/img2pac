const Promise     = require('bluebird');
const readFile    = Promise.promisify(require('fs').readFile);
const writeFile   = Promise.promisify(require('fs').writeFile);
const dxt         = require('bi-dxt-js');
const imageSize   = require('probe-image-size');
const Concentrate = require('concentrate');
const getPixels   = require('get-pixels');

module.exports = toPAC;

/**
 * @param {Buffer|String} source
 * @param {String}        [dest] - destination
 *
 * @return {Promise}
 */
function toPAC(source, dest) {
    let promise, meta;

    if (typeof source === 'string') {
        promise = readFile(source);
    } else {
        promise = Promise.resolve(source);
    }

    return promise.then(function(data) {
        meta = imageSize.sync(data);
        return _getPixels(data, meta.mime);
    }).then(function(pixels) {
        const DXTDATA = Buffer.from(
            dxt.compress(pixels.data, meta.width, meta.height, dxt.flags.DXT5)
        );

        const pac = Concentrate()
            .buffer(Buffer.from('05ff', 'hex'))
            .uint16le(0)
            .uint16le(meta.width)
            .uint16le(meta.height)
            .buffer(uInt24BE(DXTDATA.length))
            .buffer(DXTDATA)
            .uint16le(0)
            .result();

        if (typeof dest === 'string' && dest) {
            return writeFile(dest, pac).return(pac);
        }

        return pac;
    });
}

function uInt24BE(int) {
    let pos = 0
    ,   buff = Buffer.alloc(3);
    int = +int;

    buff[pos] = (int >>> 16);
    buff[pos + 1] = (int >>> 8);
    buff[pos + 2] = int;

    return buff;
}

/**
 * @param {Buffer} data
 * @param {String} mime - image mime type
 */
function _getPixels(data, mime) {
    return new Promise(function(resolve, reject) {
        getPixels(data, mime, function(err, pixels) {
            if (err) {
                return reject(err);
            }

            return resolve(pixels);
        });
    });
}
