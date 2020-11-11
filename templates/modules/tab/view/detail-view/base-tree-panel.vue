<template>
  <mu-tab-panel
    :name="$options.tabName"
    content-spacing="between"
    class="mu-flex-box"
    direction="column"
    @activated="initialize">
    <mu-bar>
      <template v-if="$options.namespace === 'labor'">
        <mu-button
          :disabled="!editable"
          :caption="selectCaption"
          button-type="primary"
          button-style="outline"
          @click="selectProcedure" />
        <mu-button
          :disabled="!editable"
          caption="删除"
          button-type="danger"
          button-style="outline"
          @click="removeItem" />
      </template>
      <mu-space />
      <mu-button
        caption="设置本期发生量等于剩余量"
        :disabled="!editable"
        @click="useAllLeftAmount" />
    </mu-bar>
    <kaka-grid
      v-if="loaded"
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
      selectCaption () {
        return this.context.mode === 'single' ? '选择分包工序' : '选择业主清单'
      },
      activeInferredCost () {
        return this.$store.state.activeInferredCost
      },
      editable () {
        return this.context.editable && this.activeInferredCost.status !== 'done'
      }
    },
    watch: {
      editable () {
        this.$refs?.grid?.invalidate?.()
      }
    },
    methods: {
      async removeItem () {
        const records = this.getSelectedRecords()
        if (records.length === 0) return
        const { dispatch, commit } = this.$store
        dispatch(`${this.$options.namespace}/removeItems`, { id: this.activeInferredCost.id, items: records })
          .then(async result => {
            if (result) {
              notify('success', '删除成功')
              dispatch(`${this.$options.namespace}/getItems`, this.activeInferredCost.id)
              const inferredCost = await dispatch('getItem', this.activeInferredCost.id)
              if (inferredCost) {
                commit('updateActiveItem', inferredCost)
              }
            }
          })
      },
      async initialize () {
        // if (!this.records) {
        await this.load()
        this.loaded = true
        // }
      },
      selectProcedure () {
        this.$emit('selectProcedure')
      },
      async useAllLeftAmount () {
        const updateItems = this.records
          .filter(v =>
            (v.recordType === 'procedure' && this.$options.namespace === 'labor') ||
            (v.recordType === 'material' && this.$options.namespace === 'material')
          )
          .map(v => {
            const preQuantity = fixedQuantity(v.cumulativeQuantity - v.currentQuantity)
            const totalQuantity = fixedQuantity(v.totalQuantity * (v.lossRate || 1))
            const remainQuantity = fixedQuantity(
              totalQuantity - preQuantity
            )
            return {
              id: v.actualId,
              currentQuantity: remainQuantity > 0 ? remainQuantity : v.currentQuantity
            }
          })
        const { dispatch, commit } = this.$store
        const result = await dispatch(
          `${this.$options.namespace}/updateItems`,
          { items: updateItems, inferredCostId: this.activeInferredCost.id }
        )
        if (result) {
          await dispatch(`${this.$options.namespace}/getItems`, this.activeInferredCost.id)
          notify('success', '设置成功')
          const inferredCost = await dispatch('getItem', this.activeInferredCost.id)
          if (inferredCost) {
            commit('updateActiveItem', inferredCost)
          }
        }
      },
      validateValue (record, field, value, oldValue) {
        if (isNaN(Number(value)) && value !== '' && value !== null) {
          error('请输入合法数值')
          return false
        }
        if (
          (record.currentQuantity +
            record.cumulativeQuantity - Number(oldValue)) >
          record.totalQuantity * (record.lossRate || 1)) {
          error('累计（含本期）应发生量不能超过责任成本总量')
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
        const updateItem = {
          id: record.actualId,
          currentQuantity: fixedQuantity(value)
        }
        const result = await dispatch(`${this.$options.namespace}/updateItems`, {
          items: [updateItem],
          inferredCostId: this.activeInferredCost.id
        })
        if (result) {
          const inferredCost = await dispatch('getItem', this.activeInferredCost.id)
          if (inferredCost) {
            commit('updateActiveItem', inferredCost)
          }
          record.cumulativeQuantity = fixedQuantity(
            updateItem.currentQuantity + record.cumulativeQuantity - oldValue
          )
          record.completionPercent = this.$options.namespace === 'labor'
            ? fixed(record.totalQuantity ? (record.currentQuantity / record.totalQuantity) : 0, 4)
            : null
          updateItem.amountNonTax = fixedAmount(
            record.unitPriceNonTax * record.currentQuantity
          )
          updateItem.tax = fixedAmount(
            updateItem.amountNonTax * record.taxRate / 100
          )
          updateItem.amount = fixedAmount(
            updateItem.amountNonTax + updateItem.tax
          )
          // const diffAmountNonTax =
          //   updateItem.amountNonTax - record.amountNonTax

          // const key = `${this.$options.namespace}Amount`
          // commit('updateActiveItem', {
          //   amount: fixedAmount(this.activeInferredCost.amount + diffAmountNonTax),
          //   [key]: fixedAmount(this.activeInferredCost[key] + diffAmountNonTax)
          // })

          commit(`${this.$options.namespace}/updateItem`, updateItem)
          notify('success', '更新成功')
        } else {
          record[field] = oldValue
        }
      },
      async load () {
        // if (!this.items) {
        this.refresh()
        // }
      },
      async refresh () {
        await this.$store.dispatch(`${this.$options.namespace}/getItems`, this.activeInferredCost.id)
      },
      expandAll (vm) {
        vm.kakaGrid.dataSource.expandAll()
      }
    }
  }
</script>

