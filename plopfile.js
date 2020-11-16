var fs = require('fs')
var path = require('path')
var initMessage = require('./bin/plop-init.js')

module.exports = function (plop) {
  initMessage()
  plop.setGenerator('component', {
    description: 'create a Template',
    prompts: [
      {
        type: 'input',
        name: 'dirName',
        message: '创建文件名'
      },
      {
        type: 'list',
        name: 'temp',
        default: 'tab',
        choices: [
          { name: '主细表类型（带页签模板）', value: 'tab' }
          // { name: '主细表类型（不带页签）', value: 'noTab' }
        ]
      }
    ],
    actions: function (data) {
      var gen = `${plop.getPlopfilePath()}/templates`
      var dirName = data.dirName
      var temp = data.temp
      var modules = []
      var server = []
      var cwd = process.cwd()
      var startingPath = ''
      var startingTemplatePath = path.resolve(`${gen}/modules/${temp}`)
      switch (temp) {
        case 'other':
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
            modules.push(action)
            modules.push({
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
      // 模块层actions
      recursiveFiles(startingPath, startingTemplatePath)
      // 服务层actions
      recursiveFiles(`${cwd}/src/server/${dirName}`, path.resolve(`${gen}/server`))
      var actions = [...modules, ...server]
      return actions
    }
  })
}
