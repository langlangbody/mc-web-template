module.exports = function (plop) {
  return [
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
  ]
}
