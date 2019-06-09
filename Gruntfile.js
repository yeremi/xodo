module.exports = function (grunt) {
    'use strict';

    // CONFIG
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                src: ['index.js'],
                dest: 'src/xodo.min.js'
            }
        },
        jshint: {
            all: ['index.js']
        }
    });

    // PLUGINS
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // TASKS
    grunt.registerTask('default', ['jshint', 'uglify']);
};