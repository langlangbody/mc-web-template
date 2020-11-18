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
        { name: '主细表类型（带页签模板）', value: 'tab' },
        { name: '主细表类型（不带页签）', value: 'noTab' }
      ]
    },
    {
      type: 'list',
      name: 'chooseTab',
      message: '条件语句chooseTab',
      choices: [
        { name: '使用默认页签', value: 'default' },
        { name: '自定义页签', value: 'custom' }
      ],
      when: function (answers) {
        return answers.temp && answers.temp === 'tab'
      }
    },
    {
      type: 'input',
      name: 'tabs',
      message: '"|" 分割 例：labor:劳务|combined:合计',
      when: function (answers) {
        return answers.chooseTab && answers.chooseTab === 'custom'
      }
    },
    {
      type: 'input',
      name: 'chooseNoTab',
      message: '条件语句chooseNoTab',
      when: function (answers) {
        return answers.temp && answers.temp === 'noTab'
      }
    }
  ]
}
