/** @module scc
 * @memberOf node-captions
 */
/*jslint node: true, nomen: true, plusplus: true, unparam: true, todo: true, regexp: true */
'use strict';

var fs = require('fs'),
    macros = require('./macros.js'),
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
    read: function (file, options, callback) {
        var lines;
        fs.readFile(file, options, function (err, data) {
            if (err) {
                //err
                return callback(err);
            }
            if (/\r\n/.test(data.toString())) {
                lines = data.toString().split('\r\n');
            } else {
                lines = data.toString().split('\n');
            }
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
    toJSON: function (lines) {
        var buffer = [],
            lineIdx,
            line,
            cmdIdx,
            command,
            commandCount = 0,
            splitLine,
            timeStamp,
            newCaption,
            commandArray,
            output = [];

        function makeCaptionBlock(buffer, timeStamp, commandCount) {
            var cap = {
                timeStamp: timeStamp,
                startTimeMicro: module.exports.processTimeStamp(timeStamp, 3),
                endTimeMicro: undefined,
                frames: buffer.length,
                commands: commandCount,
                text: module.exports.translate(buffer),
                buffer: buffer.join(' ')
            };
            return cap;

        }

        for (lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            line = lines[lineIdx];
            if (!module.exports.verify(line) && line !== '') {
                splitLine = line.toLowerCase().split('\t');
                timeStamp = splitLine[0];
                commandArray = splitLine[1].split(' ');
                for (cmdIdx = 0; cmdIdx < commandArray.length; cmdIdx++) {
                    command = commandArray[cmdIdx];
                    commandCount++;
                    if (command === '9420') {
                        //9420 == pop_on
                        buffer.push(command);
                    } else if (command === '94ae') {
                        //94ae == clear pop buffer
                        buffer = [];
                    } else if (command === '942f' && buffer.length >= 0) {
                        //942f == pop_buffer
                        buffer.push(command);
                        newCaption = makeCaptionBlock(buffer, timeStamp, commandCount);
                        output.push(newCaption);
                        buffer = [];
                        commandCount = 0;
                    } else if (command === '942c') {
                        //942c == clear screen
                        buffer.push(command);
                        newCaption = makeCaptionBlock(buffer, timeStamp, commandCount);
                        if (output[output.length - 1] && output[output.length - 1].endTimeMicro === undefined) {
                            output[output.length - 1].endTimeMicro = newCaption.startTimeMicro;
                        }
                        output.push(newCaption);
                        commandCount = 0;
                        buffer = [];
                    } else {
                        buffer.push(command);
                    }
                }
            }
        }
        return module.exports.timeCaptions(output);
        //return output;
    },
    timeCaptions: function (captions) {
        var index;

        for (index = 1; index < captions.length - 1; index++) {
            if (captions[index].endTimeMicro === undefined && captions[index + 1].endTimeMicro !== undefined) {
                captions[index].endTimeMicro = captions[index + 1].endTimeMicro;
            }

            if (captions[index].startTimeMicro === captions[index].endTimeMicro && captions[index - 1].endTimeMicro === captions[index].startTimeMicro) {
                captions[index].endTimeMicro = module.exports.processTimeStamp(captions[index].timeStamp, captions[index].frames);
            }
            if (captions[index].endTimeMicro < captions[index].startTimeMicro) {
                captions[index].endTimeMicro = captions[index].startTimeMicro;
            }
            if (captions[index].startTimeMicro < captions[index - 1].endTimeMicro) {
                captions[index].startTimeMicro = captions[index - 1].endTimeMicro;
                index = 1;
            }
        }
        for (index = 1; index < captions.length - 1; index++) {
            //    if (captions[index].endTimeMicro === undefined && captions[index + 1].startTimeMicro !== undefined) {
            //        captions[index].endTimeMicro = captions[index + 1].endTimeMicro;
            //    }
            if (captions[index].startTimeMicro === captions[index].endTimeMicro && captions[index - 1].endTimeMicro === captions[index].startTimeMicro) {
                captions[index].endTimeMicro = module.exports.processTimeStamp(captions[index].timeStamp, captions[index].frames + 30);
            }
            if (captions[index].endTimeMicro < captions[index].startTimeMicro) {
                captions[index].endTimeMicro = captions[index].startTimeMicro;
            }
            if (captions[index].startTimeMicro < captions[index - 1].endTimeMicro) {
                captions[index].startTimeMicro = captions[index - 1].endTimeMicro;
                index = 1;
            }
        }

        if (captions[0].endTimeMicro === undefined && captions[0].startTimeMicro === undefined) {
            //set end time for last caption..
            captions[0].startTimeMicro = module.exports.processTimeStamp(captions[0].timeStamp, 0);
            captions[0].endTimeMicro = module.exports.processTimeStamp(captions[0].timeStamp, 0);
        }
        return captions;
    },
    processTimeStamp: function (timeStamp, frames) {
        var newFrames,
            stamp = timeStamp.replace(/;/g, ':').split(':'),
            stampFrames = parseInt(stamp[stamp.length - 1], 10);
        if ((stampFrames +  frames) <= 9) {
            newFrames = "0" + (stampFrames +  frames);
        } else {
            newFrames = (stampFrames +  frames);
        }
        stamp[stamp.length - 1] = newFrames;
        return module.exports.translateTime(stamp.join(':'));
    },

    /**
     * translates SCC HEX bits to readable characters based on mappings in config/
     * @function
     * @public
     * @param {string} SCCText - Entire SCC file content
     */
    translate: function (SCCText) {
        var text = [],
            lastCommand,
            index = 0;

        function parseCharacter(chars) {
            var arr = [];
            if (chars.length > 0) {
                chars.match(/.{1,2}/gi).map(function (c) {
                    arr.push(mapping.CHARACTERS[c]);
                });
            }
            return arr.join('');
        }

        for (index = 0; index < SCCText.length; index++) {
            if (lastCommand !== SCCText[index]) {
                if (mapping.COMMANDS.hasOwnProperty(SCCText[index])) {
                    text.push(mapping.COMMANDS[SCCText[index]]);
                } else if (mapping.EXTENDED_CHARS.hasOwnProperty(SCCText[index])) {
                    text.push(mapping.EXTENDED_CHARS[SCCText[index]]);
                } else if (mapping.SPECIAL_CHARS.hasOwnProperty(SCCText[index])) {
                    text.push(mapping.SPECIAL_CHARS[SCCText[index]]);
                } else {
                    text.push(parseCharacter(SCCText[index]));
                }
            }
            lastCommand = SCCText[index];
        }
        //return module.exports.removeDuplicateMacros(module.exports.fixItalics(module.exports.removeDuplicateMacros(text.join(''))));
        return macros.cleanMacros(macros.fixItalics(text.join('')));
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
        return (microSeconds > 0) ?  microSeconds : 0;
    }
};

