var captions = require('../captions.js'),
    should = require('should');

describe('Read SCC file, generate XML', function () {
    var SCCFile,
        jsonObj,
        xmlFile;

    before(function(done) {
        captions.scc.read('./test/test.scc', function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
            jsonObj = captions.scc.toJSON(data);
            xmlFile = captions.xml.generate(jsonObj);
            done();
        });
    });

    it('should have a length of 47286', function(done) {
        xmlFile.length.should.equal(47286);
        done();
    });

    it('should have a length of 632', function(done) {
        captions.scc.toJSON(SCCFile).length.should.equal(632);
        done();
    });
});

