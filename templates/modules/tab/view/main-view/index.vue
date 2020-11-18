<template>
  <div class="mu-absolute-fit">
    <mu-v-box class="mu-absolute-fit" content-spacing>
      <mu-bar>
        <mu-button
          caption="新增xxx期间统计"
          button-type="primary"
          :disabled="!disabled"
          @click="showAddItemDlg = true" />
      </mu-bar>
      <grid
        ref="grid"
        size="1" />
    </mu-v-box>
    <dlg-add-item v-model="showAddItemDlg" title="新增xxx统计" />
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  import Grid from './grid.vue'
  import DlgAddItem from '../dialog/dlg-add-item.vue'

  export default {
    inject: ['application', 'context'],
    components: {
      Grid,
      DlgAddItem
    },
    data () {
      return {
        showAddItemDlg: false
      }
    },
    computed: {
      ...mapState('root', {
        items (state) {
          console.log('主表信息', state.items)
          return state.items || []
        }
      }),
      ...mapGetters(['editPermission']),
      disabled () {
        // 此处是对状态的条件判断  是更具当前的账单状态进行授权
        return true // this.editPermission && this.activeItem.state
      }
    },
    mounted () {
      this.$store.commit('root/SET_PERMISSIONS', this.context.permissions)
      this.application.updateBreadcrumbsTitle('xxx统计')
      this.refresh()
    },
    methods: {
      refresh () {
        this.$store.dispatch('root/loadItems')
      }
    }
  }
</script>
