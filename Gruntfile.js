module.exports = function(grunt) {
  "use strict";

  // CONFIG
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    banner: {
      compact: "/*! <%= pkg.name %> v<%= pkg.version %> https://github.com/yeremi Copyright (c) 2019 Yeremi Loli - " + "<%= grunt.template.today(\"yyyy-mm-dd\") %> */ \n"
    },
    concat: {
      options: {
        separator: "\n\n\n",
        stripBanners: true,
        banner: "<%= banner.compact %>"
      },
      "dist/xodo.js": ["src/xodo.js", "src/sizzle.js"]
    },
    minified: {
      files: {
        src: ["dist/xodo.js"],
        dest: "dist/"
      },
      docs: {
        src: ["dist/xodo.js"],
        dest: "docs/"
      },
      options: {
        banner: "<%= banner.compact %>",
        dest_filename: "xodo.min.js",
        sourcemap: false,
        allinone: true
      }

    },
    jshint: {
      all: ["src/xodo.js"]
    }
  });

  // PLUGINS
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-minified");

  // TASKS
  grunt.registerTask("default", ["jshint", "concat", "minified"]);
};