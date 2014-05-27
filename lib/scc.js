/*jslint node: true, nomen: true, plusplus: true, unparam: true, todo: true */
'use strict';

var fs = require('fs'),
    mapping = require('../config/scc.json');



var SCC_HEADER = 'Scenarist_SCC V1.0',
    SCC_HEADER_REGEX = new RegExp(SCC_HEADER),
    SCC_REGEX_STRING = "([0-9:;]*)([\t]*)((.)*)",
    SCC_REGEX = new RegExp(SCC_REGEX_STRING);


module.exports = {
    /**
     * Reads a SCC file and verifies it sees the proper header
     * @read
     * @param {string} file - File to read
     * @param {callback} callback - WHen the read is successful callback.
     */
    read: function (file, callback) {
        var lines;
        fs.readFile(file, function (err, data) {
            if (err) {
                //err
                return callback(err);
            }
            lines = data.toString().split('\r\n');
            if (module.exports.verify(lines[0])) {
                callback(undefined, lines);
            } else {
                callback("INVALID_SCC_FORMAT");
            }
        });
    },

    /**
     * Verifies a SCC file header, returns true/false
     * @verify
     * @param {string} header - Header line to verify.
     */
    verify: function (header) {
        return SCC_HEADER_REGEX.test(header.trim());
    },

    /**
     * Converts the SCC file to a proprietary JSON format
     * @toJSON
     * @param {string} data - Entire SCC file content
     */
    toJSON: function (data) {
        var json = {},
            parsed,
            index,
            frames,
            stamp,
            modified,
            startTimeMicro,
            endTimeMicro,
            counter = 1;
        json.captions = [];
        for (index = 1; index < data.length; index++) {
            if (module.exports.verify(data[index].trim()) || data[index].trim() === null || data[index].trim().length === 0) { continue; }
            parsed = data[index].trim().replace(/;/g, ':').match(SCC_REGEX);
            frames = parsed[3].split(' ').length;
            stamp = parsed[1].split(':');
            modified = parseInt(stamp[stamp.length - 1], 10) * parseInt(frames, 10);
            stamp[stamp.length - 1] = modified;
            startTimeMicro = module.exports.translateTime(parsed[1]);
            endTimeMicro = module.exports.translateTime(stamp.join(':'));
            json.captions.push(
                {
                    id: counter,
                    text: module.exports.translate(parsed[3]),
                    startTimeMicro: startTimeMicro,
                    endTimeMicro: endTimeMicro,
                    frames: frames
                }
            );
            counter++;
        }
        return json.captions;
    },

    /**
     * translates SCC HEX bits to readable characters based on mappings in config/
     * @translate
     * @param {string} SCCText - Entire SCC file content
     */
    translate: function (SCCText) {
        var text = [],
            index = 0,
            bits = SCCText.split(' ');
        function parseCharacter(chars) {
            var arr = [];
            chars.match(/.{1,2}/g).forEach(function (c) {
                arr.push(mapping.CHARACTERS[c]);
            });
            return arr.join('');
        }

        for (index = 0; index < bits.length; index++) {
            if (mapping.COMMANDS.hasOwnProperty(bits[index])) {
                text.push(mapping.COMMANDS[bits[index]]);
            } else if (mapping.EXTENDED_CHARS.hasOwnProperty(bits[index])) {
                text.push(mapping.EXTENDED_CHARS[bits[index]]);
            } else if (mapping.SPECIAL_CHARS.hasOwnProperty(bits[index])) {
                text.push(mapping.SPECIAL_CHARS[bits[index]]);
            } else {
                text.push(parseCharacter(bits[index]));
            }
        }
        return module.exports.removeDuplicateMacros(text.join(''));
    },

    /**
     * Converts SCC timestamps to microseconds
     * @translateTime
     * @param {string} timeStamp - Timestamp of SCC line
     */
    translateTime: function (timeStamp) {
        var secondsPerStamp = 1.001,
            timesplit = timeStamp.split(':'),
            timestamp_seconds = (parseInt(timesplit[0], 10) * 3600 +
                                 parseInt(timesplit[1], 10) * 60 +
                                 parseInt(timesplit[2], 10) +
                                 parseInt(timesplit[3], 10) / 30),
            seconds = timestamp_seconds * secondsPerStamp,
            microSeconds = seconds * 1000 * 1000;
        return microSeconds;
    },

    /**
     * Removes duplicate macros from SCC translation. Basically a cleanup function to make the caption text pretty.
     * @removeDuplicate Macros
     * @param {string} text - Translated SCC text
     */
    removeDuplicateMacros: function (text) {
        return text.replace(/(\{break\})+/g, '{break}')
                   .replace(/(\{italic\})+/g, '{italic}')
                   .replace(/(\{end-italic\})+/g, '{end-italic}')
                   .replace(/^(\{break\})/, '');
    }
};

