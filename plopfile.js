var fs = require('fs')
var path = require('path')
var initMessage = require('./bin/plop-init.js')

module.exports = function (plop) {
  initMessage()
  plop.setGenerator('component', {
    description: 'create a component',
    prompts: [
      {
        type: 'input',
        name: 'dirName',
        message: '创建文件名'
      },
      {
        type: 'list',
        name: 'temp',
        default: 'tabs',
        choices: [
          { name: '主细表类型（带tab页签）', value: 'tab' },
          { name: '主细表类型（不带tab页签）', value: 'noTab' },
          { name: '普通组件', value: 'common' }
        ]
      }
    ],
    actions: (data) => {
      var gen = `${plop.getPlopfilePath()}/templates`
      console.log('data', data)
      var dirName = data.dirName
      var temp = data.temp
      var actions = []
      var modify = []
      var cwd = process.cwd()
      var startingPath = ''
      var startingTemplatePath = path.resolve(`${gen}/modules/${temp}`)
      switch (temp) {
        case 'common':
          startingPath = `${cwd}/src/web-content/component/${dirName}`
          break
        default:
          startingPath = `${cwd}/src/web-content/module/${dirName}`
          break
      }
      var recursiveFiles = (path1, templateDir) => {
        var files = fs.readdirSync(templateDir)
        files.forEach(file => {
          const isFile = file.includes('.') || file.endsWith('file')
          if (isFile) {
            var action = {
              type: 'add',
              path: `${path1}/${file}`,
              templateFile: `${templateDir}/${file}`
            }
            actions.push(action)
            modify.push({
              type: 'modify',
              path: `${path1}/${file}`,
              transform (fileContents, data) {
                return fileContents.replace(/generateTemplate/g, dirName)
              }
            })
          } else if (fs.existsSync(`${templateDir}/${file}`) &&
          fs.lstatSync(`${templateDir}/${file}`).isDirectory()) {
            return recursiveFiles(`${path1}/${file}`, `${templateDir}/${file}`)
          }
        })
        return actions
      }
      actions = recursiveFiles(startingPath, startingTemplatePath)

      actions.push({
        type: 'add',
        path: `${cwd}/src/server/${dirName}/index.js`,
        templateFile: path.resolve(`${gen}/server/index.js`),
        skipIfExists: true,
        abortOnFail: true
      })
      modify.push({
        type: 'modify',
        path: `${cwd}/src/server/${dirName}/index.js`,
        transform (fileContents, data) {
          return fileContents.replace(/generateTemplate/g, dirName)
        }
      })
      return [...actions, ...modify]
    }
  })
}
