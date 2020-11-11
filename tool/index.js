var updateNotifier = require('update-notifier')

var pkg = require('../package.json')
function checkVersion () {
  const notifier = updateNotifier({ pkg, updateCheckInterval: 0 })

  if (notifier.update) {
    notifier.notify()
  }
}

module.exports = checkVersion
