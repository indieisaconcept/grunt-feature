/*
 * grunt-feature-toggle
 * https://github.com/indieisaconcept/grunt-feature-toggle
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

var util = require('./lib/util');

module.exports = function(grunt) {

    'use strict';

    // ==================================
    // DEFAULTS
    // ==================================

    // ==================================
    // PLUGIN DEFAULTS
    // ==================================

    // ==================================
    // TASK
    // ==================================

    grunt.registerMultiTask('feature', 'Generate feature toggle config', function() {

        var done = this.async();

        done();

    });

};
