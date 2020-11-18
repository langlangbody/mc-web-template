var initMessage = require('./bin/plop-init.js')

const webGenerator = require('./lib/web')
const serverGenerator = require('./lib/server')
module.exports = function (plop) {
  initMessage()
  webGenerator(plop)
  serverGenerator(plop)
}
