var captions = require('../captions.js'),
    should = require('should');

describe('Read SCC file, generate TTML', function () {
    var SCCFile,
        jsonObj,
        ttmlFile;

    before(function(done) {
        captions.scc.read('./test/captions/test.scc', {}, function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
            jsonObj = captions.scc.toJSON(data);
            ttmlFile = captions.ttml.generate(jsonObj);
            done();
        });
    });

    it('should have a length of 109297', function(done) {
        ttmlFile.length.should.equal(109297);
        done();
    });
});

