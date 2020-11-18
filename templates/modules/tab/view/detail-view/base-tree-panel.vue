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
      :frozen-col-count="3"
      :columns="columns"
      :records="records"
      @load="expandAll"
      @cellchange="cellchange" />
  </mu-tab-panel>
</template>
<script>
  import { mapState, mapGetters } from 'vuex'
  import { notify, error } from 'mussel'

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
        records (state) {
          return state[this.$options.namespace]?.items || []
        }
      }),
      editable () {
        // TODO: status状态值更具具体定义变动
        return this.editPermission && this.activeItem?.status !== 'done'
      }
    },
    watch: {
      editable () {
        // eslint-disable-next-line babel/no-unused-expressions
        this.$refs?.grid?.invalidate?.()
      }
    },
    methods: {
      initialize () {
        this.load()
      },
      async removeItem () {
        // 获取选中项内容
        const records = this.getSelectedRecords()
        if (records.length === 0) return
        const { dispatch, commit } = this.$store
        dispatch(`${this.$options.namespace}/removeItems`, { id: this.activeItem.id, items: records })
          .then(async result => {
            if (result) {
              notify('success', '删除成功')
              // 删除成功后重新获取当前标签页的数据
              dispatch(`${this.$options.namespace}/loadItems`, this.activeItem.id)
              // 重新获取当前主表的数据信息
              const inferredCost = await dispatch('root/getItem', this.activeItem.id)
              // 将获取的数据传递到store中
              commit('updateActiveItem', inferredCost)
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
        // const { dispatch, commit } = this.$store
        const { value, field, record, oldValue, col } = data
        if (col === 0) {
          return
        }
        if (!this.validateValue(record, field, value, oldValue)) {
          record[field] = oldValue
        }
        // TODO: 处理数据之间的计算联动
      },
      async load () {
        await this.$store.dispatch(`${this.$options.namespace}/loadItems`, this.activeItem.id)
      },
      expandAll (vm) {
        vm.kakaGrid.dataSource.expandAll()
      }
    }
  }
</script>
