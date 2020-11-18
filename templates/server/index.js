const home = require('./api/home')
const tab1 = require('./api/tab1')
const tab2 = require('./api/tab2')
module.exports = [
  ...home,
  ...tab1,
  ...tab2
]
