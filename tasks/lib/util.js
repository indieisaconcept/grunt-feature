/*
 * grunt-feature
 * https://github.com/indieisaconcept/grunt-feature
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

var path = require('path'),
    merge = require('deepmerge'),
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

    'use strict';

    var util = {},
        _ = grunt.util._,
        cache = {};

    // TEMPLATES
    // ------------------------------

    util.template = function (/* String */ filepath) {

        var name = path.basename(filepath, '.hbs'),
            extension,
            source,
            compiled;

        // Normalize name
        // --------------------

        name = name.split('.');
        extension = name[1];
        name = name[0];

        // Pre-compile if needed
        // ---------------------

        if (cache && !cache[name]) {

            source = grunt.file.read(filepath);
            compiled = Handlebars.compile(source);

            cache[name] = {
                compiled: compiled,
                extension: extension
            };
        }

        return cache[name];

    };

    // PRE-CACHE
    // ------------------------------

    grunt.file.expand('templates/default/*.hbs').forEach(function (/* String */ template) {
        util.template(template);
    });

    util.generate = function (/* Array */ collection, /* Object */ options) {

        var namespace,
            src;

        collection = !_.isArray(collection) ? [collection] : collection;
        src = util.merge(collection);
        namespace = util.register(src, options);

        // PRE-CACH RESULT
        // ------------------------------

        collection = {
            option: options || {},
            src: src,
            namespace: namespace
        };

        return function (/* String */ template) {

            template = util.template(template);

            return {
                extension: template && template.extension,
                content: template && template.compiled(collection)
            };

        };

    };

    util.debug = function debug (/* Object */ collection, /* String */ label) {

        if (label) {
            grunt.verbose.subhead(label);
        }

        collection.forEach(function (/* Object */ item, /* Number */ index) {
            grunt.verbose.writeflags({
                data: item
            }, index + 1);
        });

        grunt.verbose.writeln('');

    };

    util.merge = function (/* Array */ collection) {

        collection = !_.isArray(collection) ? [collection] : collection;

        var result = {};

        collection.forEach(function (/* Object */ item) {

            result = merge(result, item);

        });

        return result;

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

                meta = ('value' in current || 'description' in current);

                if (meta) {

                    processed.push({
                        name: registered,
                        value: current.value,
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
                    value: current,
                    description: null
                });

            }

        });

        return processed;

    };

    return util;

};
