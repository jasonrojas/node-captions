/** @module scc
 * @memberOf node-captions
 */
/*jslint node: true, nomen: true, plusplus: true, unparam: true, todo: true, regexp: true */
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
     * @function
     * @param {string} file - File to read
     * @param {callback} callback - WHen the read is successful callback.
     * @public
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
     * @function
     * @param {string} header - Header line to verify.
     * @public
     */
    verify: function (header) {
        return SCC_HEADER_REGEX.test(header.trim());
    },

    /**
     * Converts the SCC file to a proprietary JSON format
     * @function
     * @param {string} data - Entire SCC file content
     * @public
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
            if (data[index].trim() !== '' && module.exports.verify(data[index]) === false && data[index].trim() !== 'null' && data[index].trim().length > 0) {
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
        }
        return json.captions;
    },

    /**
     * translates SCC HEX bits to readable characters based on mappings in config/
     * @function
     * @public
     * @param {string} SCCText - Entire SCC file content
     */
    translate: function (SCCText) {
        var text = [],
            index = 0,
            bits = SCCText.split(' ');
        function parseCharacter(chars) {
            var arr = [];
            chars.match(/.{1,2}/gi).forEach(function (c) {
                arr.push(mapping.CHARACTERS[c]);
            });
            return arr.join('');
        }

        for (index = 0; index < bits.length; index++) {
            if (mapping.COMMANDS.hasOwnProperty(bits[index].toLowerCase())) {
                text.push(mapping.COMMANDS[bits[index].toLowerCase()]);
            } else if (mapping.EXTENDED_CHARS.hasOwnProperty(bits[index].toLowerCase())) {
                text.push(mapping.EXTENDED_CHARS[bits[index].toLowerCase()]);
            } else if (mapping.SPECIAL_CHARS.hasOwnProperty(bits[index].toLowerCase())) {
                text.push(mapping.SPECIAL_CHARS[bits[index].toLowerCase()]);
            } else {
                text.push(parseCharacter(bits[index].toLowerCase()));
            }
        }
        return module.exports.removeDuplicateMacros(text.join(''));
    },

    /**
     * Converts SCC timestamps to microseconds
     * @function
     * @public
     * @param {string} timeStamp - Timestamp of SCC line
     */
    translateTime: function (timeStamp) {
        var secondsPerStamp = 1.001,
            timesplit = timeStamp.split(':'),
            timestampSeconds = (parseInt(timesplit[0], 10) * 3600 +
                                parseInt(timesplit[1], 10) * 60 +
                                parseInt(timesplit[2], 10) +
                                parseInt(timesplit[3], 10) / 30),
            seconds = timestampSeconds * secondsPerStamp,
            microSeconds = seconds * 1000 * 1000;
        return microSeconds;
    },

    /**
     * Removes duplicate macros from SCC translation. Basically a cleanup function to make the caption text pretty.
     * @function
     * @public
     * @param {string} text - Translated SCC text
     */
    removeDuplicateMacros: function (text) {
        var italicStarts, italicEnds, tmpText, i = 1;
        tmpText = text.replace(/(\{break\})+/g, '{break}')
                      .replace(/(\{italic\})+/g, '{italic}')
                      .replace(/(\{end-italic\})+/g, '{end-italic}')
                      .replace(/^(\{break\})/, '')
                      .replace(/^(\{end-italic\})/, '')
                      .replace(/\{break\}\{italic\}/, '{break}');

        if (/\{italic\}/.test(tmpText) || /\{end-italic\}/.test(tmpText)) {
            if (tmpText.match(/\{italic\}/g)) {
                italicStarts = tmpText.match(/\{italic\}/g).length;
            } else {
                italicStarts = 0;
            }
            if (tmpText.match(/\{end-italic\}/g)) {
                italicEnds = tmpText.match(/\{end-italic\}/g).length;
            } else {
                italicEnds = 0;
            }
            if (italicStarts > italicEnds) {
                // we need to add an end
                for (i = 1; i <= (italicStarts - italicEnds); i++) {
                    tmpText += '{end-italic}';
                }
            }
            if (italicEnds > italicStarts) {
                tmpText = tmpText.replace(/\{end-italic\}/g, '');
            }
        }
        return tmpText;
    }
};

