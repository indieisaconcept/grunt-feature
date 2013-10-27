/*
 * grunt-feature
 * https://github.com/indieisaconcept/grunt-feature
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

var base = './fixtures',
    util = require('../../../../tasks/lib/util')(require('grunt')),

    fixtures = {

        single: {
            source      : require(base + '/single.json'),
            expected    : require(base + '/single.expected.json'),
            message     : 'should generate a config array'
        },

        literal: {
            source      : require(base + '/literal.json'),
            expected    : require(base + '/literal.expected.json'),
            message     : 'should support objects'
        },

        deep: {
            source      : require(base + '/deep.json'),
            expected    : require(base + '/deep.expected.json'),
            message     : "should support nesting"
        },

        options: {

            source      : function () {

                return [require(base + '/single.json'), {
                    namespace: 'ft',
                    delimiter: '_'
                }];

            },

            expected    : require(base + '/options.expected.json'),
            message     : 'should support option overrides'

        },

    };

module.exports.util = {

    setUp: function(done) {

        // setup here if necessary
        done();

    },

    register: function(test) {

        var register = util.register,
            tests    = Object.keys(fixtures);

        test.expect(tests.length);

        tests.forEach(function (tst) {

            tst = fixtures[tst];

            var source = typeof tst.source === 'function' ? tst.source() : [tst.source];

            test.deepEqual(register.apply(register, source), tst.expected, tst.message);

        });

        test.done();

    }

};
