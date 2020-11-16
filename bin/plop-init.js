var chalk = require('chalk')
var pkg = require('../package.json')
module.exports = function initMessage () {
  console.info(
    `${chalk.green(
      'Welcome to the creatmc',
      pkg.version + '!'
    )} Please enter ${chalk.green('creatmc')} in root directory project`
  )
}
