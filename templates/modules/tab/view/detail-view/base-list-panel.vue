<template>
  <mu-tab-panel
    :name="$options.tabName"
    content-spacing="between"
    class="mu-flex-box"
    direction="column"
    @activated="initialize">
    <mu-bar>
      <mu-button
        :disabled="!editable || editing"
        :caption="$options.selectCaption"
        button-type="primary"
        button-style="outline"
        @click="selectProcedure" />
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
      v-if="loaded"
      ref="grid"
      size="1"
      :frozen-col-count="3"
      :columns="columns"
      :records="editingRecords"
      @cellchange="cellchange" />
    <dlg-select-item v-model="showSelectDlg" />
  </mu-tab-panel>
</template>
<script>

  import cloneDeep from 'lodash.clonedeep'
  import { warn, notify } from 'mussel'
  import { fixedNumber } from '@mctech/biz-data-utils'

  const { fixedQuantity } = fixedNumber
  export default {
    inject: ['context'],
    data () {
      return {
        editing: false,
        loaded: false,
        showSelectDlg: false,
        updatedItems: [],
        deletedItems: [],
        editingRecords: []
      }
    },
    computed: {
      records () {
        return this.$store.state[this.$options.namespace].items
      },
      editable () {
        return this.activeInferredCost.status !== 'done' && this.context.editable
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
      activeInferredCost () {
        return this.$store.state.activeInferredCost
      },
      showWarnBox () {
        return this.$store.state.showWarnBox
      }
    },
    watch: {
      records () {
        this.init()
        this.editing = false
      },
      editing (newVal) {
        if (newVal) {
          this.$store.commit('setEditingItem', { editing: newVal, name: this.$options.tabName })
        } else {
          this.$store.commit('setEditingItem', { editing: false, name: null })
        }
      },
      showWarnBox (newVal) {
        if (newVal) {
          this.$store.commit('setWarnBoxState', false)
          this.cancel()
        }
      }
    },
    methods: {
      selectProcedure () {
        this.showSelectDlg = true
      },
      async load () {
        this.$store.dispatch(`${this.$options.namespace}/getItems`, this.activeInferredCost.id)
      },
      async initialize () {
        if (!this.records) {
          await this.load()
          this.loaded = true
        }
      },
      init () {
        this.editingRecords = cloneDeep(this.records)
        this.updatedItems = []
        this.deletedItems = []
      },
      async removeItem () {
        const items = this.$refs.grid.getSelectedRecords()
        if (items.length === 0) return
        this.deletedItems.push(...items)
        this.editingRecords = this.editingRecords.filter(
          v => !this.deletedItemMap[v.id]
        )
      },
      startEditing () {
        this.editing = true
        this.$refs.grid.invalidate()
      },
      async save () {
        const result = await this.$store.dispatch(`${this.$options.namespace}/save`, {
          updatedItems: this.updatedItems,
          deletedItems: this.deletedItems,
          inferredCostId: this.activeInferredCost.id
        })
        if (result) {
          notify('success', '保存成功')
          this.$store.commit(`${this.$options.namespace}/setItems`, this.editingRecords)
          const inferredCost = await this.$store.dispatch('getItem', this.activeInferredCost.id)
          if (inferredCost) {
            this.$store.commit('updateActiveItem', inferredCost)
          }
        }
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
        record[field] = fixedQuantity(value)
        if (!this.updatedItemMap[record.id]) {
          this.updatedItems.push(record)
        }
        this.doRelatedChanges(record, field, oldValue)
      }
    }
  }
</script>
