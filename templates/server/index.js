var modulesFiles = require.context('./api', true, /\.js$/)
var modules = modulesFiles.keys().reduce(function (modules, modulePath) {
  var moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  var value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
module.exports = [
  ...modules
]
