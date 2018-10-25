module.exports=function(grunt){

	grunt.initConfig({
		watch:{
			js: {
				files: ['public/js/**','models/**/*.js','schemas/**/*.js'],
				//tasks: ['jsinit'],
				options: {
					livereload: true
					}
				}
			},
			nodemon: {
				dev: {
					options: {
						file: 'app.js',
						args: [],
						ignoredFiles: ['README.md','node_modules/**','.DS_Store'],
						watchedExtensions: ['js','html'],
						watchedFolders: ['./'],
						debug: true,
						delayTime: 1,
						env: {
							PORT: 8080
						},
						cwd: __dirname
					}
				}
			},

			concurrent: {
				tasks: ['nodemon','watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		
		})
	

	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-nodemon')
	grunt.loadNpmTasks('grunt-concurrent')

	grunt.option('force',true)
	grunt.registerTask('default',['concurrent'])
}