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

        fixtures: {
            path: [
                'test/specs/util/register/fixtures/single.json',
                'test/specs/util/register/fixtures/deep.json'
            ]
        },

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

                toggles: {
                    one: true
                },
                test: {
                    test: true
                }

            },

            auto: {

                options: {

                    namespace: 'ft',
                    delimiter: '~',

                    template: {
                        custom: 'templates/custom.js.hbs'
                    },

                    toggles: {
                        two: true
                    }

                },

                files: {
                    'tmp/_config.scss': '<%=fixtures.path %>',
                    'tmp/_config.less': '<%=fixtures.path %>',
                    'tmp/config.json': '<%=fixtures.path %>',
                    'tmp/config-amd.amd.js': '<%=fixtures.path %>',
                    'tmp/config-commonjs.commonjs.js': '<%=fixtures.path %>',
                    'tmp/config-custom.custom.js': '<%=fixtures.path %>',
                    'tmp/config-glob-<!%= template %>.{scss,less,json,amd,commonjs}': '<%=fixtures.path %>'
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
