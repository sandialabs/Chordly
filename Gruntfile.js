module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['js/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            minimize: {
                options: {
                    ASCIIOnly: true,
                    preserveComments: 'some',
                    compress: true,
                    sourceMap: true,
                    mangle: true,
                },
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            },
            beautify: {
                options: {
                    ASCIIOnly: true,
                    preserveComments: 'all',
                    compress: false,
                    beautify: true,
                    banner: '/* <%= pkg.name %> <%= pkg.version %> built <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                files: {
                    'dist/<%= pkg.name %>.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        qunit: {
            files: ['js/tests/*.html']
        },
        jshint: {
            options: {

                laxbreak: true,
                laxcomma: true,
                'globals': {
                    'jQuery': true
                }
            },
            files: ['Gruntfile.js', 'js/*.js']
        },
        watch: {
            files: ['js/*.js', 'js/tests/*.js'],
            tasks: ['test']
        },
        copy: {
            main: {
                options: {
                    process: function(content, srcpath) {
                        return grunt.template.process(content);
                    }
                },
                expand: true,
                flatten: true,
                src: 'template/**',
                dest: '.'
            }
        },
        clean: ['dist/', 'bower.json', 'chord.jquery.json'],
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('build', ['concat', 'uglify:minimize', 'uglify:beautify', 'copy']);

    grunt.registerTask('default', ['test', 'build']);

};