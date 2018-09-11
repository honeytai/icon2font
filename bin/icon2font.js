#! /usr/bin/env node

const program = require('commander');
const func = require('../');
const inquirer = require('inquirer');
const chalk = require('chalk');
const _ = require('lodash')
program
    .version('2.1.0')
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