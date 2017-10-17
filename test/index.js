const tmp            = require('tmp');
const Promise        = require('bluebird');
const fs             = require('fs');
const path           = require('path');
const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

const toPAC = require('../index.js');
const expect = chai.expect;

chai.use(chaiAsPromised);
chai.should();

describe('toPAC', function() {

    before(function() {
        tmp.setGracefulCleanup();
        this.tmpDir = tmp.dirSync({unsafeCleanup: true});
    });

    ['test1.png', 'test2.png', 'test3.jpg'].forEach(function(file, index) {
        it(`should return a resolved promise with a Buffer ${index}`, function() {
            let p = path.resolve(__dirname + `/img/${file}`);
            return toPAC(p).should.be.fulfilled.then(function(pac) {
                pac.should.be.instanceof(Buffer);
            });
        });

        it(`should return a resolved promise with a Buffer ${index}`, function() {
            let p = path.resolve(__dirname + `/img/${file}`);
            let data = fs.readFileSync(p);

            return toPAC(data).should.be.fulfilled.then(function(pac) {
                pac.should.be.instanceof(Buffer);
            });
        });

        it(`should create ${path.parse(file).name}.pac file in provided directory`, function() {
            let p = path.resolve(__dirname + `/img/${file}`);
            let dest = path.resolve(this.tmpDir.name + `/${path.parse(file).name}.pac`);

            return toPAC(p, dest).should.be.fulfilled.then(function(pac) {
                pac.should.be.instanceof(Buffer);
                fs.readFileSync(dest).toString('hex').should.be.equal(pac.toString('hex'));
            });
        });
    });
});
