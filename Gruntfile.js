'use strict';

module.exports = function (grunt) {
    var codeFiles = [ 'lib/*.js', 'captions.js' ];
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['build'],
        mocha_istanbul: {
            coverage: {
                src: 'test',
                options: {
                    root: './',
                    coverage: true,
                    check: {
                        statements: 82,
                        branches: 52,
                        functions: 84,
                        lines: 83
                    },
                    reportFormats: ['text', 'html', 'lcov'],
                    coverageFolder: 'build/report'
                }
            }
        },
        jsdoc: {
            dist: {
                src: codeFiles,
                options: {
                    destination: 'build/doc'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
	    all: ['Gruntfile.js', codeFiles]
        },
        jsbeautifier: {
            files: codeFiles,
            options: {
                    js: {
                        max_preserve_newlines: 2
                    }
            }
        },

        jslint: {
            server: {
	        src: codeFiles,
                directives: {
                    node: true,
                    todo: true,
                    laxcomma: true
                },
                options: {
                    errorsOnly: true,
                    failOnError: false
                }
            }
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['jshint', 'jsbeautifier', 'mocha_istanbul:coverage', 'jsdoc']);

    grunt.event.on('coverage', function (lcov, done) {
        if (lcov) {
            done();
        }
    });
};
