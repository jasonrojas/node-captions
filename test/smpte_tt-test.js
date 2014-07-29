var captions = require('../captions.js'),
    should = require('should');

describe('Read SCC file, generate SMPTE-TT', function () {
    var SCCFile,
        jsonObj,
        smpte_ttFile;

    before(function(done) {
        captions.scc.read('./test/captions/test.scc', function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
            jsonObj = captions.scc.toJSON(data);
            smpte_ttFile = captions.smpte_tt.generate(jsonObj);
            done();
        });
    });

    it('should have a length of 47386', function(done) {
        smpte_ttFile.length.should.equal(47386);
        done();
    });

    it('should have a length of 632', function(done) {
        captions.scc.toJSON(SCCFile).length.should.equal(632);
        done();
    });
});

