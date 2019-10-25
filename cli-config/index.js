// #!/usr/bin/env node
const fs = require('fs');
const { resolve } = require('path');
const program = require('commander');
const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const fuilPath = resolve(process.cwd(),`./${name}/`);
program.version('1.0.0', '-v, --version')
  .command('init <name>')
  .action((name) => {
    if(!fs.existsSync(name)){
        const spinner = ora('正在下载模板...');
        spinner.start();
        download('direct:https://github.com/AlanSean/template.git', name, {clone: true}, (err) => {
            if(err){
                spinner.fail();
                console.log(symbols.error, chalk.red(err));
            }else{
                fs.readdir(fuilPath, 'utf8', function (err,data) {
                    data.forEach(function(item, index) {
                        ((filepath) => {
                           filepath = resolve(fuilPath,'./'+item);
                           fs.readFile(filepath,'utf8',function(err,files){
                                var result = files.replace(/<%name%>/g, name);
                                fs.writeFile(filepath, result, 'utf8', function (err) {
                                     if (err) return console.log(err);
                                });
                           })
                        })(item);
                    });
                });

                spinner.succeed();
            }
        })
    }else{
      // 错误提示项目已存在，避免覆盖原有项目
      console.log(symbols.error, chalk.red('项目已存在'));
    }
  })
program.parse(process.argv);
