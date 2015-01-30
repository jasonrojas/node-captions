/** @module scc
 * @memberOf node-captions
 */
/*jslint node: true, nomen: true, plusplus: true, unparam: true, todo: true, regexp: true */
'use strict';

var errors = require('../errors');
var SUB_REGEX_STRING = /^\{(\d+)\}\{(\d+)\}(.*?)$/;


module.exports = {

    /**
     * Parses sub captions, errors if format is invalid
     * @function
     * @param {string} filedata - String of caption data
     * @param {callback} callback - function to call when complete
     * @public
     */
    parse: function (filedata, callback) {
        var lines;
        lines = filedata.toString().split(/(?:\r\n|\r|\n)/gm);
        if (module.exports.verify(lines)) {
            return callback(null, lines);
        }
        return callback(new errors.InvalidFormatError('Invalid Sub Format'));
    },

    /**
     * verifies sub data
     * @function
     * @param {array} data - JSON array of captions
     * @public
     */
    verify: function (data) {
        //has to be an array of lines.
        return (SUB_REGEX_STRING.test(data[0]));
    },

    /**
     * Converts the SUB file to a proprietary JSON format
     * @function
     * @param {string} data - Entire SUB file content
     * @param {Number} fps - Fps of the movie file
     * @public
     */
    toJSON: function (fps, data) {
        var json = {},
            parsed,
            index,
            textStart,
            startTimeMicro,
            endTimeMicro,
            captionText,
            counter = 1;
        json.captions = [];
        for (index = 0; index < data.length; index++) {
            if (data[index].trim() !== '' && data[index].trim().length > 0) {
                parsed = data[index].trim().match(SUB_REGEX_STRING);
                textStart = parsed[3].lastIndexOf('}') > 0 || 0;
                captionText = parsed[3].substr(textStart).replace('|','{break}');
                startTimeMicro = module.exports.translateTime(Number(parsed[1]), fps);
                endTimeMicro = module.exports.translateTime(Number(parsed[2]), fps);

                if (captionText !== '')
                {
                    json.captions.push({
                        id: counter,
                        text: captionText,
                        startTimeMicro: startTimeMicro,
                        endTimeMicro: endTimeMicro
                    });
                    counter++;
                }
            }
        }
        return json.captions;
    },

    /**
     * Converts SUB timestamps to microseconds
     * @function
     * @public
     * @param {string} timeStamp - Timestamp of SUB line
     * @param {Number} fps - Fps of the movie file
     */
    translateTime: function (timeStamp, fps) {
        return timeStamp/fps*1000*1000;
    }
};

