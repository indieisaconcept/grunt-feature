/*
 * grunt-feature-toggle
 * https://github.com/indieisaconcept/grunt-feature-toggle
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
        templates = {};

    // TEMPLATES
    // ------------------------------

    util.template = function (/* String */ filepath, /* Object */ cache) {

        var name = path.basename(filepath, '.hbs'),
            source = grunt.file.read(filepath),
            compiled = Handlebars.compile(source);

        if (cache && !cache[name]) {
            cache[name] = compiled;
        }

        return compiled;

    };

    grunt.file.expand('templates/**/*.hbs').forEach(function (/* String */ template) {
        util.template(template, templates);
    });

    util.generate = function (/* Array */ collection, /* String */ template, /* Object */ options) {

        var processor = templates[template] || util.template(template),
            namespace,
            src;

        collection = !_.isArray(collection) ? [collection] : collection;
        src = util.merge(collection);
        namespace = util.register(src, options);

        if (processor) {

            collection = processor({
                option: options || {},
                src: src,
                namespace: namespace
            });

        }

        return collection;

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
