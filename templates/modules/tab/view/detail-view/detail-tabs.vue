<template>
  <mu-tabs :active-tab="activeTab" model-control="external" @change="tabChange">
    <tab-labor ref="labor" @selectProcedure="select('labors')" />
    <tab-material ref="material" @selectProcedure="select('materials')" />
    <tab-rental-material />
    <tab-transferable-material />
    <tab-rental-machine />
    <tab-transferable-machine />
    <tab-other />
    <dlg-select-procedure
      v-model="showSelectDlg"
      :type="type"
      @finished="finished" />
  </mu-tabs>
</template>

<script>
  import TabLabor from './tab-labor'
  import TabMaterial from './tab-material'
  import TabTransferableMaterial from './tab-transferable-material'
  import TabTransferableMachine from './tab-transferable-machine'
  import TabRentalMaterial from './tab-rental-material'
  import TabRentalMachine from './tab-rental-machine'
  import TabOther from './tab-other.vue'
  import DlgSelectProcedure from './dlg-select-procedure.vue'

  export default {
    inject: ['context'],
    components: {
      TabLabor,
      TabOther,
      TabMaterial,
      TabRentalMaterial,
      TabTransferableMaterial,
      TabRentalMachine,
      TabTransferableMachine,
      DlgSelectProcedure
    },
    data () {
      return {
        activeTab: '劳务',
        showSelectDlg: false,
        type: null
      }
    },
    methods: {
      tabChange (value) {
        const { editing, name } = this.$store.state.editingItem
        if (editing) {
          this.activeTab = name
          this.$store.commit('setWarnBoxState', true)
          return
        }
        this.activeTab = value
      },
      select (type) {
        this.type = type
        this.showSelectDlg = true
      },
      finished () {
        this.$refs[this.type]?.refresh?.()
      }
    }
  }
</script>
