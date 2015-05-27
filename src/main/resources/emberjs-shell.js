/*global process, require */

(function() {
    'use strict';
    var args = process.argv,
        fs = require('fs'),
        mkdirp = require('mkdirp'),
        path = require('path');

    var SOURCE_FILE_MAPPINGS_ARG = 2;
    var TARGET_ARG = 3;
    var OPTIONS_ARG = 4;

    var sourceFileMappings = JSON.parse(args[SOURCE_FILE_MAPPINGS_ARG]);
    var target = args[TARGET_ARG];
    var options = JSON.parse(args[OPTIONS_ARG]);

    var compiler = require(options.compiler);

    var sourcesToProcess = sourceFileMappings.length;
    var results = [];
    var problems = [];

    function compileDone() {
        if (--sourcesToProcess === 0) {
            console.log("\u0010" + JSON.stringify({results: results, problems: problems}));
        }
    }

    function throwIfErr(e) {
        if (e) throw e;
    }

    /** Matches a file extension (everything after and including the dot) */
    var extension = /\.[^/\\]*$/;

    sourceFileMappings.forEach(function (mapping) {
        var input = mapping[0];
        var relativePath = mapping[1];
        var outputFile = relativePath.replace(extension, '.js');
        var templateName = relativePath.replace(extension, '').replace(/\\/g, '/');
        var output = path.join(target, outputFile);

        fs.readFile(input, 'utf8', function (e, contents) {
            throwIfErr(e);

            try {
                var template = compiler.precompile(contents, false);

                mkdirp(path.dirname(output), function (e) {
                    throwIfErr(e);

                    var js = "Ember.TEMPLATES['" + templateName + "'] = Ember.HTMLBars.template(" + template + ");";

                    fs.writeFile(output, js, 'utf8', function (e) {
                        throwIfErr(e);

                        results.push({
                            source: input,
                            result: {
                                filesRead: [ input ],
                                filesWritten: [ output ]
                            }
                        });
                        compileDone();
                    });
                });
            } catch (err) {
                // HACK parse the line number from the error message
                var mat = err.message.match(/error on line (\d+):/)
                       || err.message.match(/\(on line (\d+)\)/);
                var line = mat && parseInt(mat[1]);

                problems.push({
                    message: err.message,
                    severity: 'error',
                    source: input,
                    lineNumber: line || 0,
                    lineContent: line && contents.split('\n')[line - 1],
                    characterOffset: 0 // TODO include column number in error
                });
                results.push({
                    source: input,
                    result: null
                });

                compileDone();
            }
        });
    });
})();
