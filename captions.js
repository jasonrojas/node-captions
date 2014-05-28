/**
* Creates an instance of the node-captions module. This module allows you to convert from
* one caption format to another. See the README.
* @module node-captions
* @version 0.0.1
* @author Jason Rojas <jason.rojas@mgo.com>
* @see http://github.com/jasonrojas/node-captions
* @returns An instance of the node-captions module.
*/

module.exports = {
    scc: require('./lib/scc.js'),
    srt: require('./lib/srt.js'),
    smi: require('./lib/smi.js'),
    vtt: require('./lib/vtt.js'),
    smpte_tt: require('./lib/smpte_tt.js'),
    ttml: require('./lib/ttml.js')
};
