<template>
  <mu-tabs :active-tab="activeTab" model-control="external" @change="tabChange">
    <tab-first />
    <tab-second />
  </mu-tabs>
</template>

<script>
  import TabFirst from './tab/tab1'
  import TabSecond from './tab/tab2'

  export default {
    inject: ['context'],
    components: {
      TabFirst,
      TabSecond
    },
    data () {
      return {
        activeTab: '标签1',
        showSelectDlg: false,
        type: null
      }
    },
    methods: {
      tabChange (value) {
        // const { editing, name } = this.$store.state.editingItem
        // if (editing) {
        //   this.activeTab = name
        //   this.$store.commit('setWarnBoxState', true)
        //   return
        // }
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
