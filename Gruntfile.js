/*
 * grunt-feature-toggle
 * https://github.com/indieisaconcept/grunt-feature-toggle
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

var matchdep = require('matchdep'),
    Handlebars = require('handlebars');

// HELPERS
// ------------------------------

Handlebars.registerHelper('string', function (value) {
    return value.toString();
});

Handlebars.registerHelper('json', function(data) {
    return JSON.stringify(data, undefined, 2);
});

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


            },

            auto: {

                options: {

                    namespace: 'ft',
                    delimiter: '~',

                    template: {
                        custom: 'templates/custom.js.tmp'
                    }

                },

                files: {
                    'tmp/_config.scss': '<%=fixtures.path %>',
                    'tmp/_config.less': '<%=fixtures.path %>',
                    'tmp/_config.styl': '<%=fixtures.path %>',
                    'tmp/config.json': '<%=fixtures.path %>',
                    'tmp/config-amd.amd.js': '<%=fixtures.path %>',
                    'tmp/config-common.common.js': '<%=fixtures.path %>',
                    'tmp/config-custom.custom.js': '<%=fixtures.path %>',
                    'tmp/config-glob-<!%= template %>.{scss,less,styl,json,amd,common}': '<%=fixtures.path %>'
                }
            },

            // GENERATE USING DEFAULT _ TEMPLATES
            // ----------------------------------

            underscore: {

                files: {
                    'tmp/_config-<!%= template %>.{scss,less,json,common,amd,styl}': '<%=fixtures.path %>'
                }

            },

            // GENERATE USING HANDLEBARS
            // ------------------------------

            handlebars: {

                options: {

                    engine: function (/* String */ template, /* Object */ data) {

                        var compiled = Handlebars.compile(template);

                        return compiled(data);

                    },

                    template: {
                        scss: 'test/fixtures/templates/hbs/scss.hbs'
                    }

                },

                files: {
                    'tmp/_config-<!%= template %>.{scss}': '<%=fixtures.path %>'
                }

            }

        }

    });

    // ==================================
    // TARGETS
    // ==================================

    // Default task(s).

    grunt.loadTasks('tasks');
    grunt.registerTask('default', 'clean jshint nodeunit feature'.split(' '));

};
