#! /usr/bin/env node

const program = require('commander');
const path = require("path");
const copy = require('copy-template-dir');
const inquirer = require('inquirer');
const chalk = require('chalk');
const _ = require('lodash')

const { svgFont, cleanFont } = require('./svg2font/index.js');
const func = function(inputdir, outputdir, fontname){
  const project_root = process.cwd(); 
  const fonts_root = path.resolve(project_root, outputdir);
  const icon_dir = path.resolve(project_root, inputdir)
  const script_root = path.resolve(__dirname); 
  const font_temp = path.resolve(script_root, 'template');

  let unicode_html = [];
  let logohtml = '';
  let cssIconHtml = [];
  let cssString = [];

  cleanFont(fonts_root); //先清理下输入路径下的内容
  svgFont(fonts_root, fontname, icon_dir, cssIconHtml, unicode_html, cssString);
  copy(font_temp, fonts_root, {
    fontname: fontname,
    unicode: unicode_html.join(''),
    svg_content: '',
    logosvg: logohtml,
    timestamp: new Date().getTime(),
    cssString: cssString.join(''),
    cssIconHtml: cssIconHtml.join(''),
  }, (err, createdFiles) => {
    if (err) throw err
    createdFiles.forEach(filePath => console.log(`Created ${filePath} `))
    console.log(chalk.green('copy svg icon done!'+'\n'+'thank you for use~'))
  }) 
}

program
    .version('2.0.2')
    .usage('<inputdir> <outputdir> <fontname>')
    .description('convert icon to font automaticly')
    .option('-i, --inputdir <inputdir>', 'inputdir')
    .option('-o, --outputdir <outputdir>', 'outputdir')
    .option('-n, --name <fontname>', 'fontname')
    .parse(process.argv)
const inputdir = program.inputdir;
const outputdir = program.outputdir;
const fontname = program.name;
if(inputdir && outputdir && fontname) {
  func(inputdir, outputdir, fontname)
} else {
  program.action(
    option => {
      config = _.assign({
        inputdir: null,
        outputdir: null,
        fontname: null
      }, option)
      let promps = []
      if(config.inputdir !== 'string'){
        promps.push({
          type: 'input',
          name: 'inputdir',
          message: 'input your input icon file direction:',
          validate: function(input){
            if(!input){
              return chalk.red('input direction can not be empty')
            }
            return true
          }
        })
      }
      if(config.outputdir !== 'string'){
        promps.push({
          type: 'input',
          name: 'outputdir',
          message: 'input your output font file direction:',
          validate: function(input){
            if(!input){
              return chalk.red('output direction can not be empty')
            }
            return true
          }
        })
      }
      if(config.fontname !== 'string'){
        promps.push({
          type: 'input',
          name: 'fontname',
          message: 'input your font name:',
          validate: function(input){
            if(!input){
              return 'output direction can not be empty'
            }
            return true
          }
        })
      }
      inquirer.prompt(promps)
      .then(ans => {
        console.log(chalk.green('your choices:'))
        console.log('input direction:'+'  '+ chalk.blue(ans.inputdir))
        console.log('output direction:'+ '  ' + chalk.blue(ans.outputdir))
        console.log('font name:'+'  '+ chalk.blue(ans.fontname))
        inquirer.prompt({
          type: 'confirm',
          name: 'test',
          default: true,
          message: 'are you sure?'
        })
        .then((conm) => {
          if(conm.test){
            func(ans.inputdir, ans.outputdir, ans.fontname)
          }
        })
    })
  }
  )
}
program.parse(process.argv)