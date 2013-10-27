/*
 * grunt-feature-toggle
 * https://github.com/indieisaconcept/grunt-feature
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

var grunt = require('grunt'),
    fixtures = {
        templates: 'erb hbs'.split(' '),
        filetypes: 'scss less styl amd.js common.js json'.split(' ')
    };

module.exports.util = {

    setUp: function(done) {

        // setup here if necessary
        done();

    },

    generate: function(test) {

        var templates = fixtures.templates,
            filetypes = fixtures.filetypes,
            filename  = '<%= engine %>/_config-<%= template %>.<%= extension %>';

        test.expect(filetypes.length * templates.length);

        templates.forEach(function (engine) {

            filetypes.forEach(function (file) {

                file = file.split('.');

                var path = grunt.template.process(filename, {
                        data: {
                            engine: engine,
                            template: file[0],
                            extension: file[1] || file[0]
                        }
                    }),
                    source,
                    expected;

                source = grunt.file.read(grunt.file.expand('tmp/' + path)[0]);
                expected = grunt.file.read(grunt.file.expand('test/expected/' + path)[0]);

                test.equal(source, expected, engine + ':' + file + ' should generate a config');

            });

        });

        test.done();

    }

};
