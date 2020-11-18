import { notify } from 'mussel'

import BaseListPanel from '../../base-list-panel.vue'

export default {
  extends: BaseListPanel,
  tabName: '标签2',
  namespace: 'tab2',
  data () {
    return {
      columns: [
        {
          type: 'checkBox',
          width: 50,
          readonly: rec => !this.editable || !this.editing
        },
        {
          caption: '核算单元',
          field: 'projectCostAccountingItemName',
          width: 'auto',
          minWidth: 200
        },
        {
          caption: '设备/费用名称',
          field: 'name',
          width: 'm'
        }
      ]
    }
  },
  methods: {
    validateValue (record, field, value) {
      if (isNaN(Number(value)) && value !== '' && value !== null) {
        notify('error', '请输入合法数值')
        return false
      }
      return true
    }
  }
}
