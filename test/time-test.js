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

    it('the first time code should be 1 hour more', function(done) {
        captions.scc.read('./test/captions/time-test.scc', {}, function(err, data) {
            captions.time.adjust('3600', 'seconds', captions.scc.toJSON(data), function (err, adjustedCaptions) {
                if (err) { throw 'ERROR ADJUSTING CAPTIONS: ' + err;}
                var oldTime = original[0].startTimeMicro;
                var adjusted = parseInt(adjustedCaptions[0].startTimeMicro - oldTime);
                adjusted.should.equal(3600000000);
                done();
            });
        });
    });
    it('the first time code should be 1 hour less', function(done) {
        captions.time.adjust('-3600', 'seconds', jsonObj, function (err, adjustedCaptions) {
            if (err) { throw 'ERROR ADJUSTING CAPTIONS: ' + err;}
            var oldTime = original[0].startTimeMicro;
            var adjusted = parseInt(oldTime - adjustedCaptions[0].startTimeMicro);
            adjusted.should.equal(3600000000);
            done();
        });
    });
});

