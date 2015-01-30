var captions = require('../captions.js'),
    should = require('should');

describe('Read SCC file, generate SAMI', function () {
    var SCCFile,
        jsonObj,
        samiFile;

    before(function(done) {
        captions.scc.read('./test/captions/test.scc', {}, function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
            jsonObj = captions.scc.toJSON(data);
            samiFile = captions.smi.generate(jsonObj);
            done();
        });
    });

    it('should have a length of 32498', function(done) {
        samiFile.length.should.equal(32498);
        done();
    });

    it('should have a length of 511', function(done) {
        captions.scc.toJSON(SCCFile).length.should.equal(511);
        done();
    });
});

