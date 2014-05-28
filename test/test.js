var should = require('should');

describe('Main module test', function () {
    var captions = require('../captions.js');

    it('should have scc module', function(done) {
        captions.should.have.property('scc');
        done();
    });
    it('should have smpte_tt module', function(done) {
        captions.should.have.property('smpte_tt');
        done();
    });
    it('should have ssrt module', function(done) {
        captions.should.have.property('srt');
        done();
    });
    it('should have smi module', function(done) {
        captions.should.have.property('smi');
        done();
    });
    it('should have ttml module', function(done) {
        captions.should.have.property('ttml');
        done();
    });
    it('should have vtt module', function(done) {
        captions.should.have.property('vtt');
        done();
    });
});

