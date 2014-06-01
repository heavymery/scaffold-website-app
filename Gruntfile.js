module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Read JSON metadata stored in package.json. (optional)
    pkg: grunt.file.readJSON('package.json'),

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
