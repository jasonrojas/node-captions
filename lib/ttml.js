/** @namespace *
 * @name ttml
 */
/*jslint node: true, nomen: true, plusplus: true, unparam: true, todo: true */
'use strict';

var fs = require('fs'),
    moment = require('moment'),
    TTML = require('../config/ttml.json');

module.exports = {

    generate: function (data) {
        var TTML_BODY = '',
            splitText,
            captions = data;

        TTML_BODY += TTML.header.join('\n') + '\n';
        captions.forEach(function (caption) {
            if (caption.text.length > 0) {
                if (/\{break\}/.test(caption.text)) {
                    splitText = caption.text.split('{break}');
                    //TODO this should count for number of breaks and add the appropriate pops where needed.
                    TTML_BODY += TTML.lineTemplate.replace('{region}', 'pop1')
                                                  .replace('{startTime}', module.exports.formatTime(caption.startTimeMicro))
                                                  .replace('{endTime}', module.exports.formatTime(caption.endTimeMicro))
                                                  .replace('{text}', module.exports.renderMacros(splitText[0])) + '\n';
                    TTML_BODY += TTML.lineTemplate.replace('{region}', 'pop2')
                                                  .replace('{startTime}', module.exports.formatTime(caption.startTimeMicro))
                                                  .replace('{endTime}', module.exports.formatTime(caption.endTimeMicro))
                                                  .replace('{text}', module.exports.renderMacros(splitText[1])) + '\n';
                } else {
                    TTML_BODY += TTML.lineTemplate.replace('{region}', 'pop1')
                                                  .replace('{startTime}', module.exports.formatTime(caption.startTimeMicro))
                                                  .replace('{endTime}', module.exports.formatTime(caption.endTimeMicro))
                                                  .replace('{text}', module.exports.renderMacros(caption.text)) + '\n';
                }
            }
        });

        return TTML_BODY + TTML.footer.join('\n') + '\n';
    },
    renderMacros: function (data) {
        return data.replace(/\{italic\}/g, '').replace(/\{end-italic\}/g, '');
    },
    formatTime: function (microseconds) {
        var milliseconds = microseconds / 1000;
        return moment.utc(milliseconds).format("HH:mm:ss:SS");
    }



};



