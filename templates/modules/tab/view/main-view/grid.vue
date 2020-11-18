<template>
  <kaka-grid :columns="columns" :records="items" />
</template>
<script>
  import { mapState, mapGetters } from 'vuex'
  import { warn, notify } from 'mussel'

  export default {
    inject: ['application', 'context'],
    data () {
      return {
        columns: [
          {
            caption: '统计周期',
            field: 'createTime',
            width: 'auto',
            type: 'captionLink',
            onClick: this.viewDetail,
            align: 'center'
          },
          {
            caption: '规格型号',
            field: rec => `${rec.model}/${rec.type}`,
            width: 'l',
            align: 'center'
          },
          {
            caption: '编制人',
            field: 'creator',
            width: 'm',
            align: 'center'
          },
          {
            caption: '更新时间',
            field: 'updateTime',
            width: 'l',
            align: 'center'
          },
          {
            caption: '删除',
            type: 'removeLink',
            width: 's',
            onClick: this.deleteProduction,
            disabled: this.disabled
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
      ...mapGetters(['editPermission', 'activeItem']),
      disabled () {
        // 此处是对状态的条件判断  是更具当前的账单状态进行授权
        return true // this.editPermission && this.activeItem.state
      }
    },
    methods: {
      async viewDetail (rec) {
        this.$store.commit('root/SET_ACTIVE_ITEM', rec)
        this.application.routerPush({
          name: 'detail',
          title: `${rec.year}年${rec.month}月xxx期间统计`
        })
      },
      async deleteProduction (rec) {
        warn(`是否删除${rec.createTime}xxx数据`, async btn => {
          if (btn === 'ok') {
            const { dispatch } = this.$store
            const status = await dispatch('root/deleteItem', rec.id)
            if (status) {
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
