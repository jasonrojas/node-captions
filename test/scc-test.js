var captions = require('../captions.js'),
    should = require('should');

describe('Reading SCC file', function () {
    var SCCFile,
        ROLLUPSCCFile,
        readErr;

    before(function(done) {
        captions.scc.read('./test/captions/test.scc', {}, function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
        });
        captions.scc.read('./test/captions/rollup.scc', {}, function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            ROLLUPSCCFile = data;
        });
        done();
    });

    it('should error if file doesnt exist', function(done) {
        captions.scc.read('nosuchfile', {}, function(err, data) {
            should.exist(err);
            done();
        });
    });

    it('should error if file is bad', function(done) {
        captions.scc.read('./test/captions/test.srt', {}, function(err, data) {
            err.should.equal('INVALID_SCC_FORMAT');
            done();
        });
    });

    it('should have a length of 1267', function(done) {
        SCCFile.length.should.equal(1267);
        done();
    });

    it('should have a length of 512', function(done) {
        captions.scc.toJSON(SCCFile).length.should.equal(512);
        done();
    });
    it('should have a length of 1300 roll up', function(done) {
        ROLLUPSCCFile.length.should.equal(1300);
        done();
    });

    it('should have a length of 637 roll up', function(done) {
        captions.scc.toJSON(ROLLUPSCCFile).length.should.equal(637);
        done();
    });
});

