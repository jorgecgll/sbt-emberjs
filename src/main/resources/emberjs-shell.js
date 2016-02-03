/*global process, require */

(function() {
    'use strict';
    var args = process.argv,
        fs = require('fs'),
        compiler = require('ember-template-compiler'),
        mkdirp = require('mkdirp'),
        fs = require('fs'),
        path = require('path');

    var SOURCE_FILE_MAPPINGS_ARG = 2;
    var TARGET_ARG = 3;

    var sourceFileMappings = JSON.parse(args[SOURCE_FILE_MAPPINGS_ARG]);
    var target = args[TARGET_ARG];

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

    /** Keeps line/column information in the error (normally eaten by handlebars) */
    compiler.EmberHandlebars.Parser.parseError = function (str, hash) {
        var err = new Error(str);
        err.line = hash.line;
        err.col = hash.loc && hash.loc.first_column;
        throw err;
    };

    /** Matches a file extension (everything after and including the dot) */
    var extension = /\.[^/\\]*$/;
    var js = "";

    sourceFileMappings.forEach(function (mapping) {
        var input = mapping[0];
        var relativePath = mapping[1];
        var templateName = relativePath.replace(extension, '').replace(/\\/g, '/');
        var output = path.join(target, 'templates.pre.js');

        try {

          var template = fs.readFileSync(input).toString();
          var precompiledTemplate = compiler.precompile(template, false);
          var js = "\n\nEmber.TEMPLATES['" + templateName + "'] = Ember.Handlebars.template(" + precompiledTemplate + ");";

          mkdirp(path.dirname(output), function (e) {

            throwIfErr(e);

            fs.appendFileSync(output, js, 'utf8' , function(e){
              throwIfErr(e);

              results.push({
                source: input,
                result: {
                  filesRead: [ input ],
                  filesWritten: [ input ]
                }
              });

              console.log(JSON.stringify(results);
            });

          });

        } catch (err) {
          problems.push({
              message: err.message,
              severity: 'error',
              source: input,
              lineNumber: err.line && err.line + 1,
              characterOffset: err.col,
              lineContent: err.line && contents.split('\n')[err.line]
          });
          results.push({
              source: input,
              result: null
          });
        }
    });

    compileDone();

})();
