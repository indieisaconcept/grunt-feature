/*
 * grunt-feature-toggle
 * https://github.com/indieisaconcept/grunt-feature-toggle
 *
 * Copyright (c) 2013 Jonathan Barnett @indieisaconcept
 * Licensed under the MIT license.
 */

'use strict';

var util = require('../../tasks/lib/util')(require('grunt')),

    fixtures = {

        single: {

            source: {
                a: true,
                b: true,
                c: false
            },

            expected: [{
                name: 'a',
                active: true,
                description: null
            }, {
                name: 'b',
                active: true,
                description: null
            }, {
                name: 'c',
                active: false,
                description: null
            }],

            message: 'should generate a config array'

        },

        nested: {

            source: {
                a: {
                    active: true,
                    description: 'This is a feature'
                }
            },

            expected: [{
                name: 'a',
                active: true,
                description: 'This is a feature'
            }],

            message: 'should support objects'

        },

        deep: {

            source: {
                a: {
                    b: true
                },
                c: {
                    d: {
                        active: true,
                        description: 'This is a feature',
                        children: {
                            e: true,
                            f: {
                                active: false
                            },
                            g: {
                                h: false
                            },
                            i: {
                                children: {
                                    j: true
                                }
                            }
                        }
                    }
                }
            },

            expected: [{
                name: 'a-b',
                active: true,
                description: null
            }, {
                name: 'c-d',
                active: true,
                description: 'This is a feature'
            }, {
                name: 'c-d-e',
                active: true,
                description: null
            }, {
                name: 'c-d-f',
                active: false,
                description: null
            }, {
                name: 'c-d-g-h',
                active: false,
                description: null
            }, {
                name: 'c-d-i-j',
                active: true,
                description: null
            }],

            message: "should support nesting"

        },

        options: {

            source: function () {

                return [{
                    a: true,
                    b: true,
                    c: false,
                    d: {
                        e: true
                    }
                }, {
                    namespace: 'ft',
                    delimiter: '_'
                }];

            },

            expected: [{
                name: 'ft_a',
                active: true,
                description: null
            }, {
                name: 'ft_b',
                active: true,
                description: null
            }, {
                name: 'ft_c',
                active: false,
                description: null
            }, {
                name: 'ft_d_e',
                active: true,
                description: null
            }],

            message: 'should support option overrides'

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
