## Synopsis

node-captions is a simple module set to convert from one caption to another. 
Currently only supports (SCC | SRT) -> SRT | VTT | SAMI | TTML | SMPTE-TT.

## Code Example

### Conversion from SCC to SRT

```javascript
var captions = require('node-captions'),
    fs = require('fs');
    captions.scc.read('path/to/scc/file.scc', {}, function (err, data) {
        if (err) { // handle your errors };
        fs.writeFile('path/to/srt/file.srt', captions.srt.generate(captions.scc.toJSON(data), function(err, result) {
            if (err) { //handle your errors };
        });
    });
```

### Read SCC adjust by X and write out SRT with adjusted data

```javascript
var captions = require('node-captions'),
    fs = require('fs');
    captions.scc.read('path/to/scc/file.scc', {}, function (err, data) {
        if (err) { // handle your errors };
        captions.time.adjust('300', 'seconds', captions.scc.toJSON(data), function (err, adjustedCaptions) {
            if (err) { //handle your errors };
            fs.writeFile('path/to/srt/file.srt', captions.srt.generate(adjustedCaptions), function(err, result) {
                if (err) { //handle your errors };
            });
        });
    });
```

## Motivation

This project was created so a nodeJS application can do stuff with caption files to support different players.
Big thanks to [pycaption](https://github.com/pbs/pycaption) for being the standard for quite some time and having the needed maps for the SCC conversion.
Some of the features I added in the headers and such (check the config dir) may need to be tuned to your liking, the ones there work for me and seem to work for the players I have tested.

## Installation

`npm install node-captions`

## API Reference

`grunt jsdoc`


## Tests

`mocha`

## Contributors

Feel free to send pull requests in a branch.

## License

[node-captions' MIT License](https://github.com/jasonrojas/node-captions/blob/master/LICENSE)
