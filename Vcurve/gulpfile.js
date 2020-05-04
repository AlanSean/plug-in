var gulp = require('gulp'),
minify = require('gulp-uglify'),//代码啊压缩
rename = require('gulp-rename'),//修改名称
pump = require('pump'),
sequence = require('run-sequence'),
plumber = require('gulp-plumber'),
babel = require('gulp-babel'),

compass = require('gulp-compass');


gulp.task('ts',function(){
    pump([
        gulp.src('./curve.js'),
        plumber({
            erroeHanlder:function(error){
                 this.emit('end')
            }
        }),
        babel(),

        minify(),
        rename(function(path){
            return path.basename = 'index'
        }),
        gulp.dest('./dist')
    ])

})
gulp.task('default',function(cb) {
    sequence('ts',cb);
})
