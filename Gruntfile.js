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
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.registerTask('default', ['jshint', 'jslint', 'mocha_istanbul:coverage', 'jsdoc']);
    grunt.event.on('coverage', function (lcov, done) {
        if (lcov) {
            done();
        }
    });
};
