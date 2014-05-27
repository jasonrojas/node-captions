var captions = require('../captions.js'),
    should = require('should');

describe('Reading SCC file', function () {
    var SCCFile,
        readErr;

    before(function(done) {
        captions.scc.read('./test/test.scc', function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
            done();
        });
    });

    it('should have a length of 1267', function(done) {
        SCCFile.length.should.equal(1267);
        done();
    });

    it('should have a length of 632', function(done) {
        captions.scc.toJSON(SCCFile).length.should.equal(632);
        done();
    });
});

