module.exports = function (grunt) {

    // A list of JS files (in load-order) for inclusion, concatenation and minification

    // NPM tasks
    // This is not installing for some reason, adding each individually
    // require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-remove-logging');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-template');

    // Create array of all javascript files
    var generateScriptTag = function(relativeSrc) {
        var scriptArr = grunt.file.expand({cwd: 'src/' + relativeSrc}, '*.js'),
            scriptReturn = '';
        for(var i = 0, len = scriptArr.length; i < len; i++) {
            scriptReturn += ('<script type="text/javascript" src="' + relativeSrc + '/' + scriptArr[i] + '"></script>\n\t');
        }
        return scriptReturn;
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        autoprefixer: {
            files: {
                expand: true,
                flatten: true,
                src: 'dist/styles/*.css',
                dest: 'dist/styles'
            },
        },

        clean: ['dist'],

        copy: {
            build: {
                cwd: 'src',
                src: [ '**', '!**/sass/**' ],
                dest: 'dist',
                expand: true
            },
            prodbuild: {
                cwd: 'src',
                src: [ '**', '!**/sass/**', '!**/js/**' ],
                dest: 'dist',
                expand: true
            },
        },

        cssmin: {
            prodbuild: {
                files: [{
                    expand: true,
                    cwd: 'dist/styles',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/styles',
                    ext: '.min.css'
                }]
            }
        },

        sass: {
            options: {
                style: 'expanded'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/styles/sass/',
                    src: '**/*.scss',
                    dest: 'dist/styles',
                    ext: '.css'
                }]
            },
            prodbuild: {
                files: [{
                    expand: true,
                    cwd: 'src/styles/sass/',
                    src: '**/*.scss',
                    dest: 'dist/styles',
                    ext: '.min.css'
                }]
            }
        },

        template: {
            build: {
                options: {
                    'data': {
                        'css': 'styles/app.css',
                        'env': 'DEV',
                        'jshead': generateScriptTag('js/libs') + generateScriptTag('js/libs/moment'),
                        'jsfoot': generateScriptTag('js'),
                    }
                },
                files: {
                    'dist/index.html': ['src/index.html']
                }
            },
            prodbuild: {
                options: {
                    'data': {
                        'css': 'styles/app.min.css',
                        'env': 'PRODUCTION',
                        'jshead': '<script type="text/javascript" src="js/loadfirst.min.js"></script>',
                        'jsfoot': '<script type="text/javascript" src="js/loadlast.min.js"></script>',
                    }
                },
                files: {
                    'dist/index.html': ['src/index.html']
                }
            }
        },

        uglify: {
            prodbuild: {
                options: {
                    mangle: false
                },
                files: {
                    'dist/js/loadfirst.min.js': [ 
                        'src/js/libs/jquery*.js',
                        'src/js/libs/*.js'
                    ],
                    'dist/js/loadlast.min.js': [ 
                        'src/js/*.js',
                    ]
                }
            },
        },

        concurrent: {
            dist: ['css']
        },

        watch: {
            all: {
                files: ['src/styles/sass/**/*.scss', 'src/js/**/*.js', 'src/**/*.html'],
                tasks: ['default']
            }
            // css: {
            //     files: 'src/styles/sass/**/*.scss',
            //     tasks: ['build']
            // },
            // js: {
            //     files: 'src/js/**',
            //     tasks: ['build']
            // }
        }
    });

    // Grunt tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('all', ['clean']);
    grunt.registerTask('cssbuild', ['sass:build', 'autoprefixer']);
    grunt.registerTask('cssprod', ['sass:prodbuild', 'autoprefixer', 'cssmin:prodbuild']);
    grunt.registerTask('build', 'Compiles all of the assets and copies the files to the build directory.', ['all', 'copy', 'cssbuild', 'template:build']);
    grunt.registerTask('prod', 'Compiles all of the assets and copies the files to the build directory for prod.', ['all', 'copy:prodbuild', 'cssprod', 'uglify:prodbuild', 'template:prodbuild']);

    // grunt.registerTask('version', 'Update build number in _data/version.json file', function () {
    //     var version = 'FE_' + grunt.template.today('yymmdd.hhmmss');
    //     // UPDATE CONFIG FILE
    //     grunt.file.write('_data/version.json', '{"version" : "' + version + '"}');
    // });
};
