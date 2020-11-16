<template>
  <mu-tab-panel
    :name="$options.tabName"
    content-spacing="between"
    class="mu-flex-box"
    direction="column"
    @activated="initialize">
    <kaka-grid
      ref="grid"
      size="1"
      key-field="id"
      parent-key-field="parentId"
      :frozen-col-count="$options.namespace === 'labor' ? 4 : 3"
      :columns="columns"
      :records="records"
      @load="expandAll"
      @cellchange="cellchange" />
  </mu-tab-panel>
</template>
<script>
  import { mapState, mapGetters } from 'vuex'
  import { fixedNumber } from '@mctech/biz-data-utils'
  import { notify, error } from 'mussel'

  const {
    fixedQuantity,
    fixedAmount,
    fixedNumber: fixed
  } = fixedNumber
  export default {
    inject: ['context'],
    data () {
      return {
        loaded: false
      }
    },
    computed: {
      ...mapGetters(['activeItem', 'editPermission']),
      ...mapState({
        items(state) {
          return state[this.$options.namespace]?.items
        }
      }),
      editable () {
        // TODO: status状态值更具具体定义变动
        return this.editPermission && this.activeItem?.status !== 'done'
      }
    },
    watch: {
      editable () {
        this.$refs?.grid?.invalidate?.()
      }
    },
    methods: {
      initialize () {
        this.load()
      },
      async removeItem () {
        const records = this.getSelectedRecords()
        if (records.length === 0) return
        const { dispatch, commit } = this.$store
        dispatch(`${this.$options.namespace}/removeItems`, { id: this.activeItem.id, items: records })
          .then(async result => {
            if (result) {
              notify('success', '删除成功')
              dispatch(`${this.$options.namespace}/getItems`, this.activeItem.id)
              const inferredCost = await dispatch('getItem', this.activeItem.id)
              if (inferredCost) {
                commit('updateActiveItem', inferredCost)
              }
            }
          })
      },

      validateValue (record, field, value, oldValue) {
        if (isNaN(Number(value)) && value !== '' && value !== null) {
          error('请输入合法数值')
          return false
        }
        return true
      },
      async cellchange (data, vm) {
        const { dispatch, commit } = this.$store
        const { value, field, record, oldValue, col } = data
        if (col === 0) {
          return
        }
        if (!this.validateValue(record, field, value, oldValue)) {
          record[field] = oldValue
          return
        }
        // TODO: 处理数据之间的计算联动
      },
      async load () {
        await this.$store.dispatch(`${this.$options.namespace}/getItems`, this.activeItem.id)
      },
      expandAll (vm) {
        vm.kakaGrid.dataSource.expandAll()
      }
    }
  }
</script>

