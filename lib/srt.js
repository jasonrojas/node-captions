/*jslint node: true, nomen: true, plusplus: true, unparam: true, todo: true */
'use strict';

var fs = require('fs'),
    moment = require('moment');
var SRT_REGEX_STRING = "/^([0-9])+\n([0-9:,]*) --> ([0-9:,]*)((\n.*)+)/m",
    SRT_REGEX = new RegExp(SRT_REGEX_STRING);

module.exports = {

    generate: function (captions) {
        var SRT_BODY = [],
            counter = 1;
        captions.forEach(function (caption) {
            if (caption.text.length > 0) {
                SRT_BODY.push(counter);
                SRT_BODY.push(module.exports.formatTime(caption.startTimeMicro) + ' --> ' + module.exports.formatTime(caption.endTimeMicro));
                SRT_BODY.push(module.exports.renderMacros(caption.text) + '\n');
                counter++;
            }
        });
        return SRT_BODY.join('\n');
    },
    renderMacros: function (data) {
        return data.replace(/\{break\}/g, '\n').replace(/\{italic\}/g, '<i>').replace(/\{end-italic\}/g, '</i>');
    },
    formatTime: function (microseconds) {
        var milliseconds = microseconds / 1000;
        return moment.utc(milliseconds).format("HH:mm:ss,SSS");
    },

    read: function (file, callback) {
        var lines;
        fs.readFile(file, function (err, data) {
            if (err) {
                //err
                return callback(err);
            }
            lines = data.toString().split(/(?:\r\n|\r|\n)/gm);
            if (module.exports.verify(lines)) {
                callback(undefined, lines);
            } else {
                callback("INVALID_SRT_FORMAT");
            }
        });
    },
    verify: function (data) {
        //has to be an array of lines.
        return (/1/.test(data[0]) && data[1].match(/-->/));
    },

    toJSON: function (data) {
        var json = {},
            index = 0,
            id,
            text,
            startTimeMicro,
            endTimeMicro,
            time;
        function lastNonEmptyLine(linesArray) {
            var idx = linesArray.length - 1;
            while (idx >= 0 && !linesArray[idx]) {
                idx--;
            }
            return idx;
        }

        json.captions = [];

        while (index < (lastNonEmptyLine(data) + 1)) {
            if (!data[index]) { continue; }
            text = [];
            //Find the ID line..
            if (/^[0-9]+$/.test(data[index])) {
                //found id line
                id = parseInt(data[index], 10);
                index++;
            }
            //next line has to be timestamp right? right?
            time = data[index].split(/[\t ]*-->[\t ]*/);
            startTimeMicro = module.exports.translateTime(time[0]);
            endTimeMicro = module.exports.translateTime(time[1]);
            index++;
            while (data[index]) {
                text.push(data[index]);
                index++;
                if (!data[index]) {
                    json.captions.push({
                        id: id,
                        text: module.exports.addMacros(text.join('\n')),
                        startTimeMicro: startTimeMicro,
                        endTimeMicro: endTimeMicro
                    });
                    break;
                }
            }
            index++;
        }
        return json.captions;

    },
    translateTime: function (timestamp) {
        //TODO check this
        var secondsPerStamp = 1.001,
            timesplit = timestamp.replace(',', ':').split(':');
        return (parseInt(timesplit[0], 10) * 3600 +
                parseInt(timesplit[1], 10) * 60 +
                parseInt(timesplit[2], 10) +
                parseInt(timesplit[3], 10) / 1000) * 1000 * 1000;

    },
    addMacros: function (text) {
        return text.replace(/\n/g, '{break}').replace(/<i>/g, '{italic}').replace(/<\/i>/g, '{end-italic}');
    }




};



