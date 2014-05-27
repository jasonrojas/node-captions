'use strict';

module.exports = function (grunt) {
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
                    reportFormats: ['text', 'lcov', 'cobertura'],
                    coverageFolder: 'build/report'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: ['Gruntfile.js', '*.js', 'lib/*.js']
        },
        jslint: {
            server: {
                src: ['*.js', 'lib/*.js'],
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
    grunt.registerTask('default', ['jshint', 'jslint', 'mocha_istanbul:coverage']);

};
