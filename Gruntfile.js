'use strict';

var CONNECT_HOST = '0.0.0.0';
var CONNECT_PORT = 9001;

var LIVERELOAD_HOST = '0.0.0.0';
var LIVERELOAD_PORT = 35731;

var lrSnippet = require('connect-livereload')({ 
  hostname: LIVERELOAD_HOST,
  port: LIVERELOAD_PORT,
});

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Read JSON metadata stored in package.json. (optional)
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      options: {
        hostname: CONNECT_HOST
      },
      livereload: {
        options: {
          port: CONNECT_PORT,
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'app')
            ]
          }
        }
      },
      dist: {
        options: {
          port: CONNECT_PORT,
          middleware: function (connect) {
            return [
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },

    watch: {
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
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
    },
    
    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      
      sassUpdate: {
        command: 'sass --compass -l -t expanded --update app/styles/sass:app/styles'
      },
      sassWatch: {
        command: 'sass --compass -l -t expanded --watch app/styles/sass:app/styles'
      },
      styleguide: {
        command: 'mkdir -p styleguide; node_modules/kss/bin/kss-node app/styles/sass styleguide -t styleguide-template --css app/styles/main.css'
      }
    }
  });

  // Server task.
  grunt.registerTask('serve', 'Launch local web server and enable live-reloading.', function(target) {
    var tasks;
    
    if (target === 'dist') {
      tasks = [
        'connect:dist:keepalive'
      ];
    } else {
      tasks = [
        'connect:livereload', 
        'watch'
      ];
    }
    
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
