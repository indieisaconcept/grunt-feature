/*
 * grunt-feature
 * https://github.com/indieisaconcept/grunt-feature
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

var path = require('path'),
    merge = require('deepmerge');

module.exports = function(grunt) {

    'use strict';

    var _ = grunt.util._,

        defaultTemplates = {
            path: 'templates/default/',
            extension: '.tmp'
        },

        util = {},
        cache = {};

    // TEMPLATES
    // ------------------------------

    util.template = function (/* String */ filepath, /* Object */ options) {

        options = options || {};

        var name = path.basename(filepath, '.' + filepath.split('.').pop()),
            notCached = false,
            extension,
            source;

        // Normalize filepath
        // --------------------

        filepath = options[name] ? options[name] : filepath;

        // Normalize name
        // --------------------

        name = name.split('.');
        extension = name[1];
        name = name[0];

        notCached = cache[name] ? notCached : options[name] && !notCached;

        console.log(notCached);

        // Pre-cache if needed
        // ---------------------

        if (notCached) {

            source = grunt.file.read(filepath);

            cache[name] = {
                source: source,
                extension: extension
            };
        }

        return cache[name];

    };

    // PRE-CACHE
    // ------------------------------

    grunt.file.expand(defaultTemplates.path + '*' + defaultTemplates.extension).forEach(function (/* String */ template) {
        util.template(template);
    });

    util.generate = function (/* Array */ collection, /* Object */ options) {

        options = options || {};

        var processor = options.engine || grunt.template.process,
            namespace,
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

            template = util.template(template, options.template);

            return {
                extension: template && template.extension,
                content: template && processor(template.source, {
                    data: collection
                })
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
