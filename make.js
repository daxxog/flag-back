/* FlagBack / make.js
 * echo 'make script for FlagBack' && node make
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

var bitfactory = require('bitfactory'),
    UglifyJS = require("uglify-js"),
    stoptime = require('stoptime'),
    fs = require('fs');

var watch = stoptime(),
    header = '';

bitfactory.make({ //routes
    "": function(err, results) {
        console.log('built FlagBack in ' + watch.elapsed() + 'ms.');
    }
}, { //dependencies
    "*": { //wildcard
        "header": function(cb) {
            fs.readFile('flag-back.h', 'utf8', function(err, data) {
                header = data;
                cb(err);
            });
        },
        "flag-back.min.js": ["header", function(cb) {
            fs.writeFileSync('flag-back.min.js', header + UglifyJS.minify('flag-back.js').code);
            cb();
        }]
    }
});