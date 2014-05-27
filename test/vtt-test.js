var captions = require('../captions.js'),
    should = require('should');

describe('Read SCC file, generate VTT', function () {
    var SCCFile,
        jsonObj,
        vttFile;

    before(function(done) {
        captions.scc.read('./test/test.scc', function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
            jsonObj = captions.scc.toJSON(data);
            vttFile = captions.vtt.generate(jsonObj);
            done();
        });
    });

    it('should have a length of 26062', function(done) {
        vttFile.length.should.equal(26062);
        done();
    });

    it('should have a length of 632', function(done) {
        captions.scc.toJSON(SCCFile).length.should.equal(632);
        done();
    });
});

