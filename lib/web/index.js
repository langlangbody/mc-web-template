const actions = require('./actions')
const prompts = require('./prompts')
module.exports = function (plop) {
  return plop.setGenerator('web', {
    description: '创建前台模板',
    prompts: [
      ...prompts(plop)
    ],
    actions: actions.bind(null, plop)
  })
}
