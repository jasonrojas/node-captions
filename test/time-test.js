var captions = require('../captions.js'),
    should = require('should');

describe('Read SCC file, adjust time', function () {
    var SCCFile,
        original,
        jsonObj;

    before(function(done) {
        captions.scc.read('./test/captions/time-test.scc', {}, function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
            jsonObj = captions.scc.toJSON(data);
            original = captions.scc.toJSON(data);
            done();
        });
    });
    it('this should zero out too many captions', function(done) {
        captions.time.adjust('-36000000', 'seconds', jsonObj, function (err, noCaptions) {
            err.should.equal('ERROR_ADJUSTMENT_ZEROS_CAPTIONS');
            done();
        });
    });
    it('this should error', function(done) {
        captions.time.adjust('-36000000', 'doesntexist', undefined, function (err, noCaptions) {
            err.should.equal('NO_CAPTIONS_OR_PRECISION_PASSED_TO_FUNCTION');
            done();
        });
    });

    it('the first time code should be 1 second more', function(done) {
        captions.time.adjust('10', 'seconds', jsonObj, function (err, adjustedCaptions) {
            var oldTime = parseInt(original[1].startTimeMicro,10);
            should.not.exist(err);
            adjustedCaptions[1].startTimeMicro.should.be.above(1000000);
            adjustedCaptions[1].startTimeMicro.should.not.be.below(1000000);
            done();
        });
    });
});

