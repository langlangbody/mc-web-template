const actions = require('./actions')
const prompts = require('./prompts')
module.exports = function (plop) {
  return plop.setGenerator('server', {
    description: '创建后台模板',
    prompts: [
      ...prompts(plop)
    ],
    actions: actions.bind(null, plop)
  })
}
