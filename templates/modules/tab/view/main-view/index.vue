<template>
  <div class="mu-absolute-fit">
    <prompt-panel
      v-if="!items"
      message="当前项目责任成本正在编制中，暂时无法进行分析操作">
      <mu-button
        button-shape="round"
        caption="刷新"
        @click="refresh" />
    </prompt-panel>
    <mu-v-box v-else class="mu-absolute-fit" content-spacing>
      <mu-bar>
        <mu-button
          caption="新增xxx期间统计"
          button-type="primary"
          :disabled="!editPermission"
          @click="showAddItemDlg = true" />
      </mu-bar>
      <grid
        ref="grid"
        size="1" />
    </mu-v-box>
    <dlg-add-item title="新增xxx统计" v-model="showAddItemDlg" />
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import { mapState, mapGetters } from 'vuex'
  import Grid from './grid.vue'
  import DlgAddItem from '../dialog/dlg-add-item.vue'

  export default {
    inject: ['application', 'context'],
    components: {
      Grid,
      DlgInferredCost
    },
    data () {
      return {
        showAddItemDlg: false
      }
    },
    computed: {
      ...mapState('root', {
        items (state) {
          return state.items
        }
      }),
      ...mapGetters(['editPermission']),
    },
    mounted () {
      this.$store.commit('root/SET_PERMISSIONS',this.context.permissions)
      // this.application.updateBreadcrumbsTitle('xxx统计')
      this.refresh()
    },
    methods: {
      refresh () {
        this.$store.dispatch('root/loadItems')
      }
    }
  }
</script>
