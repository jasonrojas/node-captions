var captions = require('../captions.js'),
    should = require('should');

describe('Read SCC file, generate VTT', function () {
    var SCCFile,
        jsonObj,
        vttFile,
        vttMinute,
        vttHour;

    before(function(done) {
        captions.scc.read('./test/captions/test.scc', {}, function(err, data) {
            if (err) { throw 'ERROR Reading test SCC file: ' + err; }
            SCCFile = data;
            jsonObj = captions.scc.toJSON(data);
            vttFile = captions.vtt.generate(jsonObj);
            vttHour = 3600000000;
            vttMinute = 60000000;
            done();
        });
    });

    it('should have a length of 25596', function(done) {
        vttFile.length.should.equal(25596);
        done();
    });

    it('should return a timestmap with hours', function(done) {
        captions.vtt.formatTime(vttHour).should.equal('01:00:00.000');
        done();
    });
    it('should return a timestmap with no hours', function(done) {
        captions.vtt.formatTime(vttMinute).should.equal('01:00.000');
        done();
    });
});

