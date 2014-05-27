/*jslint node: true, nomen: true, plusplus: true, unparam: true, todo: true */
'use strict';

var fs = require('fs'),
    moment = require('moment');

module.exports = {

    generate: function (captions) {
        var VTT_BODY = ['WEBVTT']; //header
        captions.forEach(function (caption) {
            if (caption.text.length > 0) {
                VTT_BODY.push(module.exports.formatTime(caption.startTimeMicro) + ' --> ' + module.exports.formatTime(caption.endTimeMicro));
                VTT_BODY.push(module.exports.renderMacros(caption.text) + '\n');
            }
        });
        return VTT_BODY.join('\n');
    },
    renderMacros: function (data) {
        return data.replace(/\{break\}/g, '\n').replace(/\{italic\}/g, '<i>').replace(/\{end-italic\}/g, '</i>');
    },
    formatTime: function (microseconds) {
        var milliseconds = microseconds / 1000;
        if (moment.utc(milliseconds).format("HH") > 0) {
            return moment.utc(milliseconds).format("HH:mm:ss.SSS");
        }
        return moment.utc(milliseconds).format("mm:ss.SSS");
    }

};



