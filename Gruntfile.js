module.exports = function (grunt) {
    'use strict';

    // CONFIG
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: {
            compact: '/*! <%= pkg.name %> v<%= pkg.version %> https://github.com/yeremi Copyright (c) 2019 Yeremi Loli - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */ \n'
        },
        concat: {
            options: {
                separator: '\n\n\n',
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */ \n\n'
            },
            'dist/xodo.js': ['src/sizzle.js', 'src/xodo.js']
        },
        uglify: {
            options: {
                stripbanners: true,
                banner: '<%= banner.compact %>',
                beautify: {
                    ascii_only: true
                }
            },
            dist: {
                src: ['dist/xodo.js'],
                dest: 'dist/xodo.min.js'
            },
            docs: {
                src: ['dist/xodo.js'],
                dest: 'docs/xodo.min.js'
            }
        },
        jshint: {
            all: ['src/xodo.js']
        },
    });

    // PLUGINS
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // TASKS
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};