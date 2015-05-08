/** @module vtt
 * @memberOf node-captions
 */
/*jslint node: true, nomen: true, plusplus: true, unparam: true, todo: true */
'use strict';

var fs = require('fs'),
    moment = require('moment');

function validateText(text) {
    var macro_check = new RegExp(/^({break}|{italic}|{end-italic})$/);
    //return true if the text is not just a macro
    if (macro_check.test(text.toString().replace(/\s+/g, ''))) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    /**
     * Generates VTT from JSON
     * @function
     * @param {array} captions - array of json captions
     * @public
     */

    generate: function(captions) {
        var VTT_BODY = ['WEBVTT\n']; //header
        captions.forEach(function(caption) {
            if (caption.text.length > 0 && validateText(caption.text)) {
                VTT_BODY.push(module.exports.formatTime(caption.startTimeMicro) + ' --> ' + module.exports.formatTime(caption.endTimeMicro));
                VTT_BODY.push(module.exports.renderMacros(caption.text) + '\n');
            }
        });
        return VTT_BODY.join('\n');
    },
    /**
     * renders macros into VTT stylings
     * @function
     * @param {string} data - text string to render
     * @public
     */
    renderMacros: function(data) {
        return data.replace(/\{break\}/g, '\n').replace(/\{italic\}/g, '<i>').replace(/\{end-italic\}/g, '</i>');
    },
    /**
     * formats microseconds into VTT timestamps
     * @function
     * @param {string} microseconds - microseocnds to convert to VTT timestamp
     * @public
     */
    formatTime: function(microseconds) {
        var milliseconds = microseconds / 1000;
        if (moment.utc(milliseconds).format("HH") > 0) {
            return moment.utc(milliseconds).format("HH:mm:ss.SSS");
        }
        return moment.utc(milliseconds).format("mm:ss.SSS");
    }

};
