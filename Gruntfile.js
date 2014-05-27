'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
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
    grunt.registerTask('default', ['jshint', 'jslint']);

};
