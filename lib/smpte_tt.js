/** @namespace *
 * @name smpe_tt
 */
/*jslint node: true, nomen: true, plusplus: true, unparam: true, todo: true */
'use strict';

var fs = require('fs'),
    moment = require('moment'),
    SMPTE_TT = require('../config/smpte_tt.json');

module.exports = {
    /**
     * Generate SAMI captions from JSON
     * @function
     * @name smpe_tt.generate
     * @param {array} captions - File to read
     * @public
     */
    generate: function (captions) {
        var SMPTE_TT_BODY = '';
        //
        SMPTE_TT_BODY += SMPTE_TT.header.join('\n') + '\n';
        captions.forEach(function (caption) {
            if (caption.text.length > 0) {
                SMPTE_TT_BODY += SMPTE_TT.lineTemplate.replace('{startTime}', module.exports.formatTime(caption.startTimeMicro)).replace('{endTime}', module.exports.formatTime(caption.endTimeMicro)).replace('{text}', module.exports.renderMacros(caption.text)) + '\n';
            }
        });

        return SMPTE_TT_BODY + SMPTE_TT.footer.join('\n') + '\n';
    },
    /**
     * Renders macros to SAMI specific stylings
     * @function
     * @name smpe_tt.renderMacros
     * @param {string} data - caption string to render macros for
     * @public
     */
    renderMacros: function (data) {
        return data.replace(/\{break\}/g, '<br/>').replace(/\{italic\}/g, '<span tts:fontStyle="italic">').replace(/\{end-italic\}/g, '</span>');
    },
    /**
     * Formats microseconds to SAMI timestamp
     * @function
     * @name smpe_tt.formatTime
     * @param {string} microseconds - microseconds
     * @public
     */
    formatTime: function (microseconds) {
        var milliseconds = microseconds / 1000;
        return moment.utc(milliseconds).format("HH:mm:ss:SS");
    }



};



