/*
 * grunt-feature-toggle
 * https://github.com/indieisaconcept/grunt-feature-toggle
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

    'use strict';

    var util = {},
        _ = grunt.util._;

    util.merge = function merge () {

    };

    util.register = function register (/* Object */ features, /* Object */ options) {

        options = options || {};

        var delimiter = options.delimiter || '-',
            namespace = options.namespace,
            processed = [];

        Object.keys(features).forEach(function (/* String */ name) {

            var registered = namespace ? namespace + delimiter + name : name,
                current = features[name],
                children,
                meta;

            if (_.isObject(current)) {

                meta = ('active' in current || 'description' in current);

                if (meta) {

                    processed.push({
                        name: registered,
                        active: current.active,
                        description: current.description || null
                    });

                }

                children = current.children ? current.children : !meta && current;

                if (children) {

                    processed.push.apply(processed, register(children, {
                        delimiter: delimiter,
                        namespace: registered
                    }));

                }

            } else {

                processed.push({
                    name: registered,
                    active: current,
                    description: null
                });

            }

        });

        return processed;

    };

    return util;

};
