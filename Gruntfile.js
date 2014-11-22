'use strict';

var path = require('path'),
    fs = require('fs');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var includes = require('./resources.json');

    var bowerConfig = JSON.parse(fs.readFileSync('./.bowerrc', 'utf8'));

    var yeomanConfig = {
        app: bowerConfig.appPath || 'app',
        test: bowerConfig.testPath || 'test',
        dist: bowerConfig.distPath || 'dist',
        libs: bowerConfig.libsPath || 'libs'
    };

    var externalJsSrc = includes.javascript.external.map(function (path) {
        if (typeof path === 'object') {
            return yeomanConfig.app + '/' + path.src;
        }
        return yeomanConfig.app + '/' + path;
    });

    var externalJsMin = includes.javascript.external.map(function (path) {
        if (typeof path === 'object') {
            return yeomanConfig.app + '/' + path.min;
        }
        path = path.replace(/(\.js|\.src.js)/, '.min.js');
        return yeomanConfig.app + '/' + path;
    });

    var externalJsExcludeFromBuild = includes.javascript.externalExcludeFromBuild.map(function (path) {
        return '!' + yeomanConfig.app + '/' + path;
    });

    var appJs = includes.javascript.app.map(function (path) {
        return yeomanConfig.app + '/' + path;
    });

    var appJsExcludeFromBuild = includes.javascript.appExcludeFromBuild.map(function (path) {
        return '!' + yeomanConfig.app + '/' + path;
    });

    var prototypeAppJs = appJs.slice(0); //copy appJs
    prototypeAppJs.push(yeomanConfig.app + '/mocks/**/*.js'); //insert dev stuff (mocks etc)

    var cssFiles = includes.css.map(function (path) {
        return '.tmp/' + path;
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yeoman: yeomanConfig,
        watch: {
            less: {
                files: ['<%= yeoman.app %>/styles/**/*.less',
                    '<%= yeoman.app %>/components/**/*.less',
                    '<%= yeoman.app %>/states/**/*.less'
                ],
                tasks: ['less:compile']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '.tmp/styles/**/*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
                    '<%= yeoman.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            sailslinker: {
                files: ['resources.json', '<%= yeoman.app %>/**/*.{scss,js}'],
                tasks: ['linkAssets-dev']
            }
        },
        connect: {
            options: {
                port: process.env.PORT || 9000,
                hostname: process.env.IP || 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/**/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        less: {
            options: {
                strictMath: true,
                strictUnits: true,
                strictImports: true,
                outputSourceFiles: true,
                paths: ['<%= yeoman.app %>']
            },
            compile: {
                files: {
                    '.tmp/styles/main.css': '<%= yeoman.app %>/styles/main.less'
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/**/*.js',
                        '<%= yeoman.dist %>/styles/**/*.css'
                    ]
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/assets/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/assets/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/**/*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: false,
                    removeOptionalTags: true,
                    removeEmptyElements: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: ['*.html', '!index.html', '../.tmp/index.html', 'components/**/*.html', 'states/**/*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'favicon.ico',
                        'robots.txt',
                        '.htaccess',
                        'assets/images/**/*.{gif,webp,svg}',
                        'assets/fonts/**/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/assets/images',
                    dest: '<%= yeoman.dist %>/assets/images',
                    src: [
                        'generated/*'
                    ]
                }]
            },
            tmpStyles2dist: {
                expand: true,
                cwd: '.tmp/styles/',
                dest: '<%= yeoman.dist %>/styles/',
                src: '**/*.css'
            },
            indexHTML: {
                expand: true,
                cwd: '<%= yeoman.app %>/',
                dest: '<%= yeoman.dist %>/',
                src: ['./index.html']
            },
            app: {
                expand: true,
                cwd: '<%= yeoman.app %>/',
                dest: '<%= yeoman.dist %>/',
                src: ['**/*', '!**/*.scss']
            }
        },
        concurrent: {
            server: [
                'compileStyles'
            ],
            dist: [
                'compileStyles',
                'imagemin',
                'htmlmin'
            ]
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            unit: {
                singleRun: true
            },
            watch: {
                singleRun: false
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    src: appJs.concat(appJsExcludeFromBuild),
                    dest: '.tmp/app_js/'
                }]
            }
        },
        concat: {
            options: {
                process: function (src, filepath) {
                    return '// Source: ' + filepath + '\n' + src;
                }
            },
            js: {
                src: externalJsMin.concat(['.tmp/scripts/app.js']).concat(externalJsExcludeFromBuild),
                dest: '<%= yeoman.dist %>/scripts/scripts.js'
            },
            css: {
                src: '.tmp/styles/**/*.css',
                dest: '<%= yeoman.dist %>/styles/main.css'
            }
        },
        uglify: {
            options: {
                banner: [
                    '/**',
                    ' * <%= pkg.description %>',
                    ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                    ' * @link <%= pkg.homepage %>',
                    ' * @author <%= pkg.author %>',
                    ' * @license Commercial',
                    ' */'
                ].join('\n')
            },
            dist: {
                files: {
                    '.tmp/scripts/app.js': appJs.map(function (path) {
                        return '.tmp/app_js/' + path;
                    })
                }
            }
        },
        'sails-linker': {
            devJs: {
                options: {
                    startTag: '<!--INJECT SCRIPTS-->',
                    endTag: '<!--/INJECT SCRIPTS-->',
                    fileTmpl: '<script src="%s"></script>',
                    appRoot: '<%= yeoman.app %>',
                    relative: true
                },
                files: {
                    '<%= yeoman.app %>/index.html': externalJsSrc.concat(prototypeAppJs)
                }
            },
            prodJs: {
                options: {
                    startTag: '<!--INJECT SCRIPTS-->',
                    endTag: '<!--/INJECT SCRIPTS-->',
                    fileTmpl: '<script src="%s"></script>',
                    appRoot: '<%= yeoman.dist %>',
                    relative: true
                },
                files: {
                    '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/scripts/*.js']
                }
            },
            devStyles: {
                options: {
                    startTag: '<!--INJECT STYLES-->',
                    endTag: '<!--/INJECT STYLES-->',
                    fileTmpl: '<link rel="stylesheet" href="%s">',
                    appRoot: '.tmp',
                    relative: true
                },

                files: {
                    '<%= yeoman.app %>/index.html': cssFiles
                }
            },
            prodStyles: {
                options: {
                    startTag: '<!--INJECT STYLES-->',
                    endTag: '<!--/INJECT STYLES-->',
                    fileTmpl: '<link rel="stylesheet" href="%s">',
                    appRoot: '<%= yeoman.dist %>',
                    relative: true
                },
                files: {
                    '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/styles/*.css']
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: false,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'upstream',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        },
        protractor: {
            e2e: {
                options: {
                    configFile: 'protractor.conf.js',
                    keepAlive: false, // If false, the grunt process stops when the test fails.
                    noColor: false, // If true, protractor will not use colors in its output.
                    args: {

                    }
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '**/*.css',
                    dest: '.tmp/styles/'
                }]
            }
        }

    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['concurrent:server', 'build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'linkAssets-dev',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'karma:unit'
    ]);

    grunt.registerTask('test-e2e', [
        'protractor:e2e'
    ]);

    grunt.registerTask('build', function (target) {

        if (target === 'dev') {
            console.log('Building using development profile');
            grunt.task.run([
                'test',
                'clean',
                'compileStyles',
                'autoprefixer',
                'copy:tmpStyles2dist',
                'copy:app',
                'linkAssets-dev'
            ]);
        } else {
            console.log('Building using production profile');
            grunt.task.run([
                'test',
                'clean',
                'concurrent:dist',
                'autoprefixer',
                'ngmin',
                'uglify',
                'concat:js',
                'concat:css',
                'copy:dist',
                'cssmin',
                'rev',
                'copy:indexHTML',
                'linkAssets-production',
                'htmlmin'
            ]);
        }
    });

    grunt.registerTask('linkAssets-dev', [
        'sails-linker:devStyles',
        'sails-linker:devJs'
    ]);

    grunt.registerTask('linkAssets-production', [
        'sails-linker:prodStyles',
        'sails-linker:prodJs'
    ]);

    grunt.registerTask('compileStyles', [
        'less:compile'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
