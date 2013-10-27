/*
 * grunt-feature
 * https://github.com/indieisaconcept/grunt-feature
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
            ],
            filetypes: '{scss,less,styl,json,amd,common}'
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
                        afterEach: false,
                        define: false
                    }
                }
            }

        },

        nodeunit: {
            before: ['test/specs/util/**/util.{register,merge}.js'],
            after: ['test/specs/util/util.generate.js']
        },

        // GENERATE
        // ------------------------------

        feature: {

            options: {

                toggles: {
                    one: true
                }

            },

            auto: {

                options: {

                    namespace: 'ft',
                    delimiter: '~',

                    template: {
                        custom: 'templates/custom.js.erb'
                    },

                    toggles: {
                        two: true
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
                    'tmp/config-glob-<!%= template %>.<%=fixtures.filetypes%>': '<%=fixtures.path %>'
                }
            },

            // GENERATE USING DEFAULT _ TEMPLATES
            // ----------------------------------

            erb: {

                files: {
                    'tmp/erb/_config-<!%= template %>.<%=fixtures.filetypes%>': '<%=fixtures.path %>'
                }

            },

            // GENERATE USING HANDLEBARS
            // ------------------------------

            hbs: {

                options: {

                    engine: function (/* String */ template, /* Object */ data) {
                        var compiled = Handlebars.compile(template);
                        return compiled(data);
                    },

                    template: {
                        scss    : 'test/fixtures/templates/hbs/scss.hbs',
                        less    : 'test/fixtures/templates/hbs/less.hbs',
                        styl    : 'test/fixtures/templates/hbs/styl.hbs',
                        json    : 'test/fixtures/templates/hbs/json.hbs',
                        amd     : 'test/fixtures/templates/hbs/amd.js.hbs',
                        common  : 'test/fixtures/templates/hbs/common.js.hbs',
                        custom  : 'test/fixtures/templates/hbs/custom.js.hbs'
                    }

                },

                files: {
                    'tmp/hbs/_config-<!%= template %>.<%=fixtures.filetypes%>': '<%=fixtures.path %>'
                }

            }

        }

    });

    // ==================================
    // TARGETS
    // ==================================

    // Default task(s).

    grunt.loadTasks('tasks');
    grunt.registerTask('test', 'clean jshint nodeunit:before feature nodeunit:after'.split(' '));
    grunt.registerTask('default', 'test');

};
