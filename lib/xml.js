var fs = require('fs'),
    moment = require('moment'),
    XML = require('../config/xml.json');

module.exports = {

    generate: function(captions) {
        var XML_BODY = '';
        //
        XML_BODY += XML.header.join('\n') + '\n';
        captions.forEach(function (caption) {
            if (caption.text.length > 0) {
                XML_BODY += XML.lineTemplate.replace('{startTime}', module.exports.formatTime(caption.startTimeMicro)).replace('{endTime}', module.exports.formatTime(caption.endTimeMicro)).replace('{text}', module.exports.renderMacros(caption.text)) + '\n';
            }
        });

        return XML_BODY + XML.footer.join('\n') + '\n'; 
    },
    renderMacros: function(data) {
        return data.replace(/\{break\}/g, '<br/>').replace(/\{italic\}/g, '<span tts:fontStyle="italic">').replace(/\{end-italic\}/g, '</span>');
    },
    formatTime: function(microseconds) {
        var milliseconds = microseconds / 1000;
        return moment.utc(milliseconds).format("HH:mm:ss:SS");
    }



};



