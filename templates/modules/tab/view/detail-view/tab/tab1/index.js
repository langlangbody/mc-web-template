import { fixedNumber } from '@mctech/biz-data-utils'
import BaseTreePanel from '../../base-tree-panel.vue'

const { fixedQuantity } = fixedNumber

export default {
  tabName: '标签1',
  namespace: 'tab1',
  extends: BaseTreePanel,
  data () {
    return {
      columns: [
        {
          type: 'checkBox',
          readonly: rec => !this.editable,
          width: 50
        },
        {
          caption: '名称',
          type: 'tree',
          field: 'name',
          width: 'auto',
          minWidth: 200
        },
        {
          caption: '编码',
          field: 'code',
          width: 'm'
        },
        {
          caption: '剩余量',
          field: rec =>
            rec.recordType !== 'procedure'
              ? null
              : fixedQuantity(rec.totalQuantity - rec.cumulativeQuantity),
          width: 'm'
        }
      ]
    }
  },
  methods: {
    getSelectedRecords () {
      return this.$refs.grid
        .getSelectedRecords()
        .filter(v => v.recordType === 'procedure')
    }
  }
}
