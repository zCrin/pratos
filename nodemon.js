const fs = require('fs');

/**
 * nodemon hack to make it print console.logs even when require()d
 *
 * exploits node.js require caching, requiring utils/log and altering it
 * nodemon then uses the altered object (making no-op a function that alters the settings)
 */
const nodemonLog = require('nodemon/lib/utils/log');
nodemonLog.prototype.required = Function.prototype;

const nodemon = require('nodemon');

var toqignore = [];
const testFolder = __dirname + '/node_modules/';
fs.readdir(testFolder, (error, files) => {
    var r = files.length;
    for (var s = 0; s < r; s++) {
        var file = files[s];

        if ((/pratos_(.*)/).test(file) != true) {

            toqignore.push('node_modules/' + file);

        }
        if (s == (r - 1)) {
            toqignore.push("conf/*", "log/*", "static/*", "uploads/*", "views/*")
            const monitor = nodemon({
                    script: __dirname + '/server.js',
                    ext: 'js html',
                    ignoreRoot: ['.git'],
                    delay: 15,
                    ignore: toqignore
                });
        }
    }
});

process.once('SIGINT', () => {
    monitor.once('exit', () => process.exit());
});
