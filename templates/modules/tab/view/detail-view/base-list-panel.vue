<template>
  <mu-tab-panel
    :name="$options.tabName"
    content-spacing="between"
    class="mu-flex-box"
    direction="column"
    @activated="initialize">
    <mu-bar>
      <mu-button
        v-if="editing"
        caption="删除"
        button-type="danger"
        button-style="outline"
        :disabled="!editable"
        @click="removeItem" />
      <mu-space />
      <mu-button
        v-if="!editing"
        caption="编辑"
        button-type="primary"
        button-style="outline"
        :disabled="!editable"
        @click="startEditing" />
      <template v-else>
        <mu-button
          caption="保存"
          button-type="primary"
          button-style="outline"
          :disabled="notchanged"
          @click="save" />
        <mu-button
          caption="取消"
          button-type="danger"
          button-style="outline"
          @click="cancel" />
      </template>
    </mu-bar>
    <kaka-grid
      ref="grid"
      size="1"
      :frozen-col-count="3"
      :columns="columns"
      :records="editingRecords"
      @cellchange="cellchange" />
  </mu-tab-panel>
</template>
<script>

  import cloneDeep from 'lodash.clonedeep'
  import { warn, notify } from 'mussel'
  import { mapState, mapGetters } from 'vuex'

  export default {
    inject: ['context'],
    data () {
      return {
        editing: false, // 编辑状态
        showSelectDlg: false,
        updatedItems: [], // 更新项
        deletedItems: [], // 删除项
        editingRecords: [] // 操作数据--> 拷贝原数据而来
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
        return true // TODO：  this.activeItem?.status !== 'done' && this.editPermission
      },
      notchanged () {
        return this.updatedItems.length === 0 &&
          this.deletedItems.length === 0
      },
      updatedItemMap () {
        return this.updatedItems.reduce((map, v) => {
          map[v.id] = v
          return map
        }, {})
      },
      deletedItemMap () {
        return this.deletedItems.reduce((map, v) => {
          map[v.id] = v
          return map
        }, {})
      },
      showWarnBox () {
        return this.$store.state.showWarnBox
      }
    },
    watch: {
      records () {
        this.init()
      }
    },
    methods: {
      async load () {
        this.$store.dispatch(`${this.$options.namespace}/loadItems`, this.activeItem.id)
      },
      async initialize () {
        this.load()
      },
      init () {
        this.editingRecords = cloneDeep(this.records)
        this.updatedItems = []
        this.deletedItems = []
      },
      async save () {
        const result = await this.$store.dispatch(`${this.$options.namespace}/save`, {
          updatedItems: this.updatedItems,
          deletedItems: this.deletedItems,
          inferredCostId: this.activeItem.id
        })
        if (result) {
          notify('success', '保存成功')
          this.$store.commit(`${this.$options.namespace}/setItems`, this.editingRecords)
          const inferredCost = await this.$store.dispatch('getItem', this.activeItem.id)
          if (inferredCost) {
            this.$store.commit('updateActiveItem', inferredCost)
          }
        }
      },
      startEditing () {
        this.editing = true
        this.$refs.grid.invalidate()
      },
      async removeItem () {
        const items = this.$refs.grid.getSelectedRecords()
        if (items.length === 0) return
        this.deletedItems.push(...items)
        this.editingRecords = this.editingRecords.filter(
          v => !this.deletedItemMap[v.id]
        )
      },
      cancel () {
        warn('是否取消修改？', btn => {
          if (btn === 'ok') {
            this.editing = false
            this.init()
          }
        })
      },
      cellchange (data, vm) {
        const { field, record, value, oldValue } = data
        if (field === '_selected') return
        if (!this.validateValue(record, field, value, oldValue)) {
          record[field] = oldValue
          return
        }
        if (!this.updatedItemMap[record.id]) {
          this.updatedItems.push(record)
        }
      }
    }
  }
</script>
