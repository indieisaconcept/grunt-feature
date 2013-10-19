/*
 * grunt-feature-toggle
 * https://github.com/indieisaconcept/grunt-feature-toggle
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

var matchdep = require('matchdep');

module.exports = function(grunt) {

    // ==================================
    // DEFAULTS
    // ==================================

    matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks); // load default devDependencies

    // ==================================
    // CONFIG
    // ==================================

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // RESET
        // ------------------------------

        clean: {
            test: ['tmp']
        },

        // TEST
        // ------------------------------

        jshint: {

            options: grunt.file.readJSON('.jshintrc'),

            grunt: {
                src: ['Gruntfile.js']
            },

            source: {
                src: ['tasks/**/*.js']
            },

            test: {
                src: ['test/**/*.js'],
                options: {
                    globals: {
                        describe: false,
                        it: false,
                        beforeEach: false,
                        afterEach: false
                    }
                }
            }

        },

        nodeunit: {
            tests: ['test/specs/**/*.js']
        },

        // GENERATE
        // ------------------------------

        feature: {

            options: {

                toggles: {}

            },

            scss: {
                files: {
                    'tmp/scss/_config.scss': ['test/fixtures/common.json']
                }
            }

        }

    });

    // ==================================
    // TARGETS
    // ==================================

    // Default task(s).

    grunt.loadTasks('tasks');

    grunt.registerTask('test', 'clean feature nodeunit'.split(' '));
    grunt.registerTask('default', 'jshint test'.split(' '));

};
