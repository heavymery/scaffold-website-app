'use strict';

var CONNECT_PORT = 9001;
var LIVERELOAD_PORT = 35731;

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Read JSON metadata stored in package.json. (optional)
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      options: {
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          port: CONNECT_PORT,
          middleware: function(connect) {
            var path = require('path');
            return [
              require('connect-livereload')({
                hostname: '0.0.0.0',
                port: LIVERELOAD_PORT
              }),
              connect.static(path.resolve('app'))
            ]
          }
        }
      }
    },

    watch: {
      livereload: {
        options: {
          livereload: 35731
        },
        files: [
          'app/images/**/*.{png,jpg,gif}',
          'app/styles/**/*.css',
          'app/scripts/**/*.js',
          'app/**/*.html'
        ]
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'dist'
          ]
        }]
      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: 'dist',
          src: [
            'images/**/*.{png,jpg,gif}',
            '**/*.html'
          ]
        }]
      }
    },
    
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'dist'
      }
    },

    filerev: {
      images: {
        files: [{
          expand: true,
          cwd: 'dist',
          dest: 'dist',
          src: [
            'images/**/*.{png,jpg,gif}'
          ]
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: 'dist',
          dest: 'dist',
          src: [
            'styles/**/*.css'
          ]
        }]
      },
      scripts: {
        files: [{
          expand: true,
          cwd: 'dist',
          dest: 'dist',
          src: [
            'scripts/**/*.js'
          ]
        }]
      }
    },

    usemin: {
      html: 'dist/**/*.html',
      css: 'dist/styles/**/*.css'
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: [
            'index.html'
          ],
          dest: 'dist'
        }]
      }
    }
  });

  // Server task.
  grunt.registerTask('server', 'Launch local web server and enable live-reloading.', function() {
    var tasks = [
      'connect', 
      'watch'
    ];

    grunt.task.run(tasks);
  });

  // Build task.
  grunt.registerTask('build', 'Minify CSS/JS/HTML and revisioning all static files.', function() {
    var tasks = [
      'clean:dist',
      'copy:build',
      'useminPrepare',
      'concat',
      'cssmin',
      'filerev:images',
      'usemin:css',
      'uglify',
      'filerev:styles',
      'filerev:scripts',
      'usemin:html',
      'htmlmin:dist'
    ];

    grunt.task.run(tasks);
  });

  // Default task(s).
  grunt.registerTask('default', [
    'build'
  ]);
  
};
