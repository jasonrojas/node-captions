## Synopsis

node-captions is a simple module set to convert from one caption to another. Currently only supports (SCC|SRT) -> SRT|VTT|SAMI|TTML|SMPTE-TT.

## Code Example

var captions = require('captions'),
    fs = require('fs');
captions.scc.read('path/to/scc/file.scc', function (err, data) {
        if (err) { // handle your errors };
    fs.writeFile('path/to/srt/file.srt', captions.srt.generate(captions.scc.toJSON(data), function(err, result) {
        if (err) { //handle your errors };
    })
});


## Motivation

This project was created so a nodeJS application can do stuff with caption files to support different players.

## Installation

`npm install node-captions`

## API Reference

`grunt jsdoc`


## Tests

`mocha`

## Contributors

Feel free to send pull requests in a branch.

## License

[node-captions' MIT License](https://github.com/jasonrojas/node-captions/blog/master/LICENSE)
