/*
 * grunt-feature-toggle
 * https://github.com/indieisaconcept/grunt-feature-toggle
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

var util = require('../../../tasks/lib/util')(require('grunt')),

    fixtures = {

        merge: {

            source      : [{
                a: true,
                b: false
            }, {
                a: false,
                c: true,
                d: {
                    e: {
                        f: false
                    }
                }
            }],

            expected    : {
                a: false,
                b: false,
                c: true,
                d: {
                    e: {
                        f: false
                    }
                }
            },

            message     : 'should merge configs'
        }

    };

module.exports.util = {

    setUp: function(done) {

        // setup here if necessary
        done();

    },

    merge: function(test) {

        var register = util.merge,
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
