<template>
  <kaka-grid :columns="columns" :records="items" />
</template>
<script>
  import Vuex from 'vuex'

  import { mapState, mapGetters } from 'vuex'

  export default {
    inject: ['application', 'context'],
    data () {
      return {
        columns: [
          {
            caption: '统计周期',
            field: '',
            width: 'm',
            type: 'captionLink',
            onClick: this.viewDetail,
            align: 'center'
          },
          {
            caption: '编制人',
            field: 'creator',
            width: 'm'
          },
          {
            caption: '删除',
            type: 'removeLink',
            width: 's',
            onClick: this.deleteProduction,
            disabled: () => {
              return !this.editPermission
            }
          }
        ]
      }
    },
    computed: {
      ...mapState('root', {
        items (state) {
          return state.items
        }
      }),
      ...mapGetters(['editPermission','activeItem']),
      disabled(){
        // 此处是对状态的条件判断  是更具当前的账单状态进行授权
        return this.editPermission && activeItem.state
      }
    },
    methods: {
      async viewDetail (rec) {
        this.$store.commit('root/SET_ACTIVE_ITEM', rec)
        this.application.routerPush({
          name: 'detail',
          title: `${rec.year}年${rec.month}月xxxx期间统计`
        })
      },
      async deleteProduction (rec) {
        warn(`是否删除${rec.name}`, async btn => {
          if (btn === 'ok') {
            const { dispatch } = this.$store
            if (await dispatch('deleteProduction', rec.id)) {
              // 删除成功后重新获取列表
              dispatch('root/loadItems')
              notify('success', '删除成功')
            }
          }
        })
      }
    }
  }
</script>
