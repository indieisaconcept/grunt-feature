/*
 * grunt-feature-toggle
 * https://github.com/indieisaconcept/grunt-feature-toggle
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

var path = require('path');

module.exports = function(grunt) {

    'use strict';

    // ==================================
    // PLUGIN DEFAULTS
    // ==================================
    //
    var features = require('./lib/util')(grunt),
        common = grunt.config.get('feature.options.toggles') || {}, // common feature toggles
        _ = grunt.util._;

    // ==================================
    // TASK
    // ==================================

    grunt.registerMultiTask('feature', 'Generate feature toggle config', function() {

        var done = this.async(),
            options = this.options(),
            toggles = [common, options.toggles || {}];

        grunt.log.subhead('SUMMARY');
        features.debug(toggles, 'Features');

        this.files.forEach(function(file) {

            var config = [].concat(toggles),
                dest = file.orig.dest,
                basename = path.basename(dest),
                extensions = basename.substring(basename.indexOf('.')+1).split('.'),
                template = options.template && options.template[extensions[0]] || extensions[0];

            // Normalize file destination
            // --------------------------

            dest = extensions.length > 1 ? dest.replace(basename, basename.replace('.' + extensions[0] , '')) : dest;

            file.src.forEach(function(filepath) {

                // Remove unsucessful parses
                // -------------------------

                try {
                    config.push(grunt.file.readJSON(filepath));
                }

                catch (e) {
                    grunt.log.warn('Unable to process "' + filepath + '"');
                }

            });

            // Merge and create config(s)
            // --------------------------

            config = features.generate(config, options);

            // Process templates
            // --------------------------

            template
                .replace(/([{}])/g, '')
                .split(',')
                .forEach(function (tmp) {

                    var out = dest.replace(template, tmp),
                        features = config(tmp);

                    // Normalize destination
                    // --------------------------

                    out = features.extension ? out.replace('.' + tmp, '.' + features.extension) : out;
                    out = grunt.template.process(out.replace('!%', '%'), {
                        data: {
                            template: tmp
                        }
                    });

                    grunt.file.write(out, features.content);
                    grunt.log.ok('Feature config "' + out + '" successfully created.');

                });

        });

        done();

    });

};
