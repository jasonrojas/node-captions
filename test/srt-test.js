var captions = require('../captions.js'),
    should = require('should');

describe('Reading SRT file', function () {
    var SRTFile,
        generatedSRTFile,
        badSRTFile,
        readErr;

    before(function(done) {
        captions.srt.read('./test/test.srt', function(err, data) {
            if (err) { throw 'ERROR Reading test SRT file: ' + err; }
            SRTFile = data;
            badSRTFile = 'BAD FILE';
            generatedSRTFile = captions.srt.generate(captions.srt.toJSON(data));
            done();
        });
    });
    it ('should err out', function(done) {
        captions.srt.read('./nofileexists', function(err, data) {
            should.exist(err);
            done();
        });
    });
    it ('should be an invalid format err', function(done) {
        captions.srt.read('./test/test.scc', function(err, data) {
            err.should.equal('INVALID_SRT_FORMAT');
            done();
        });
    });
    it ('should have a length of 2314', function(done) {
        SRTFile.length.should.equal(2314);
        done();
    });
    it ('should have a length of 511', function(done) {
        captions.srt.toJSON(SRTFile).length.should.equal(511);
        done();
    });
    it ('should have a length of 2314', function(done) {
        generatedSRTFile.split ('\n').length.should.equal(2314);
        done();
    });
    it ('should have a length of 511', function(done) {
        captions.srt.toJSON(captions.srt.parse(generatedSRTFile)).length.should.equal(511);
        done();
    });
});

