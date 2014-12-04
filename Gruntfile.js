'use strict';

//------------------------------------------------------------------------------
//
//  Initialize
//
//------------------------------------------------------------------------------

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

//--------------------------------------
//  Constants
//--------------------------------------

  var CONNECT_HOST = grunt.option('connect-host') || '0.0.0.0';
  var CONNECT_PORT = grunt.option('connect-port') || 9001;

  var LIVERELOAD_PORT = grunt.option('livereload-port') || 35731;

//--------------------------------------
//  Plugin tasks configuration
//--------------------------------------

  grunt.initConfig({

    path: {
      tmp: '.tmp',
      tmpImages: '<%= path.tmp %>/images',
      app: 'app',
      appImages: '<%= path.app %>/images',
      appStyles: '<%= path.app %>/styles',
      appScripts: '<%= path.app %>/scripts',
      dist: 'dist',
      distImages: '<%= path.dist %>/images',
      distStyles: '<%= path.dist %>/styles',
      distScripts: '<%= path.dist %>/scripts'
    },

    connect: {
      options: {
        hostname: CONNECT_HOST
      },
      livereload: {
        options: {
          port: CONNECT_PORT,
          livereload: LIVERELOAD_PORT,
          middleware: function(connect) {
            return [
              connect.static(require('path').resolve(grunt.config('path.app')))
            ]
          }
        }
      },
      dist: {
        options: {
          port: CONNECT_PORT,
          middleware: function (connect) {
            return [
              connect.static(require('path').resolve(grunt.config('path.dist')))
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
          '<%= path.appImages %>/**/*.{png,jpg,gif,svg}',
          '<%= path.appStyles %>/**/*.css',
          '<%= path.appScripts %>/**/*.js',
          '<%= path.app %>/**/*.html',
          '!<%= path.app %>/bower_components/**/*'
        ]
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= path.dist %>'
          ]
        }]
      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= path.app %>',
          dest: '<%= path.dist %>',
          src: [
            '**/*.html',
            '*.ico',
            '!bower_components/**',
            '!styleguide/**/*.html',
            '!styleguide-template/**/*.html'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= path.tmpImages %>',
          dest: '<%= path.distImages %>',
          src: [
            '**/*.{png,jpg,gif,svg}'
          ]
        }]
      }
    },

    useminPrepare: {
      html: '<%= path.app %>/index.html',
      options: {
        dest: '<%= path.dist %>'
      }
    },

    filerev: {
      images: {
        src: '<%= path.distImages %>/**/*.{png,jpg,gif,svg}'
      },
      styles: {
        src: '<%= path.distStyles %>/**/*.css'
      },
      scripts: {
        src: '<%= path.distScripts %>/**/*.js'
      }
    },

    usemin: {
      html: [
        '<%= path.dist %>/**/*.html',
        '!<%= path.dist %>/bower_components/**/*.html'
      ],
      css: '<%= path.distStyles %>/**/*.css'
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.dist %>',
          src: [
            'index.html'
          ],
          dest: '<%= path.dist %>'
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
          cwd: '<%= path.appImages %>',
          src: '**/*.{png,jpg,gif,svg}',
          dest: '<%= path.tmpImages %>',
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
        command: 'mkdir -p <%= path.app %>/styleguide; node_modules/kss/bin/kss-node <%= path.appStyles %>/sass <%= path.app %>/styleguide -t styleguide-template --css <%= path.appStyles %>/main.css'
      }
    }

  }); // grunt.initConfig

//--------------------------------------
//  Register tasks
//--------------------------------------

  // Serve task
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

  // Build task
  grunt.registerTask('build', 'Minify CSS/JS/HTML and revisioning all static files.', function() {
    var tasks = [
      'shell:compassCompile',
      'clean:dist',
      'newer:image:dist',
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

  // Default task
  grunt.registerTask('default', [
    'build'
  ]);

};
