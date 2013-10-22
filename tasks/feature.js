/*
 * grunt-feature
 * https://github.com/indieisaconcept/grunt-feature
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
                basename = path.basename(file.dest),
                extensions = basename.substring(basename.indexOf('.')+1).split('.'),
                template = options.template && options.template[extensions[0]] || extensions[0];

            // Normalize file destination
            // --------------------------

            file.dest = extensions.length > 1 ? file.dest.replace(basename, basename.replace('.' + extensions[0] , '')) : file.dest;

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

            // Merge and create config
            // -----------------------

            config = features.generate(config, template, options);
            grunt.file.write(file.dest, config);
            grunt.log.ok('Feature config "' + file.dest + '" successfully created.');

        });

        done();

    });

};
