'use strict';

//------------------------------------------------------------------------------
//
//  Constants
//
//------------------------------------------------------------------------------

var CONNECT_HOST = '0.0.0.0';
var CONNECT_PORT = 9001;

var LIVERELOAD_HOST = '0.0.0.0';
var LIVERELOAD_PORT = 35731;

//------------------------------------------------------------------------------
//
//  Functions
//
//------------------------------------------------------------------------------

var lrSnippet = require('connect-livereload')({ 
  hostname: LIVERELOAD_HOST,
  port: LIVERELOAD_PORT,
});

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

//------------------------------------------------------------------------------
//
//  Initialize
//
//------------------------------------------------------------------------------

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

//--------------------------------------
//  Grunt init config
//--------------------------------------

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
            '**/*.html',
            '!bower_components/**/*.html',
            '!styleguide/**/*.html',
            '!styleguide-template/**/*.html'
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
        src: 'dist/images/**/*.{png,jpg,gif}'
      },
      styles: {
        src: 'dist/styles/**/*.css'
      },
      scripts: {
        src: 'dist/scripts/**/*.js'
      }
    },

    usemin: {
      html: [
        'dist/**/*.html',
        '!dist/bower_components/**/*.html'
      ],
      // css: 'dist/styles/**/*.css' // Replacing css image url not needed. (Compass doing cash busting)
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
    
    image: {
      dist: {
        options: {
          pngquant: true,
          optipng: true,
          advpng: true,
          zopflipng: true,
          pngcrush: true,
          pngout: true,
          jpegtran: true,
          jpegRecompress: true,
          jpegoptim: true,
          gifsicle: true,
          svgo: true
        },
        files: [{
          expand: true,
          cwd: 'dist/images',
          src: '**/*.{png,jpg,gif,svg}',
          dest: 'dist/images',
        }]
      }
    },
    
    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      
      compassCompile: {
        command: 'bundle exec compass compile'
      },
      compassWatch: {
        command: 'bundle exec compass watch'
      },
      
      styleguide: {
        command: 'mkdir -p app/styleguide; node_modules/kss/bin/kss-node app/styles/sass app/styleguide -t app/styleguide-template --css app/styles/main.css'
      }
    }
  });

//--------------------------------------
//  Grunt tasks
//--------------------------------------

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
        'shell:compassWatch',
        'watch'
      ];
    }
    
    grunt.config('shell.compassWatch.options.async', true);
    
    grunt.task.run(tasks);
  });

  // Build task.
  grunt.registerTask('build', 'Minify CSS/JS/HTML and revisioning all static files.', function() {
    var tasks = [
      'shell:compassCompile',
      'clean:dist',
      'copy:build',
      'image:dist',
      'useminPrepare',
      'concat',
      'cssmin',
      'filerev:images',
      // 'usemin:css', // Replacing css image url not needed. (Compass doing cash busting)
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
