var chalk = require('chalk')
var pkg = require('../package.json')
module.exports = function initMessage () {
  console.info(
    `${chalk.green(
      'Welcome to the Modern Project Generator version',
      pkg.version + '!'
    )} Please start by selecting a project generator below:`
  )
}
