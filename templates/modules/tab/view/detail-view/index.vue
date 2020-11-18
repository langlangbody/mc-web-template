<template>
  <mu-v-box class="mu-absolute-fit" content-spacing>
    <mu-bar>
      <div class="mc-module-title">{{ title }}</div>
      <div class="mu-text-color-subtitle" style="margin-left: 16px;">
        状态：{{ status }}
      </div>
      <mu-space />
      <mu-button
        :caption="formVisible ? '折叠' : '展开'"
        @click="formVisible = !formVisible" />
      <mu-dropdown-button caption="更多" :disabled="!disabled">
        <template #dropdown>
          <mu-dropdown-item
            label="删除"
            icon-class="ipm-icon-trash-can"
            @click="deleteItem" />
        </template>
      </mu-dropdown-button>
    </mu-bar>
    <detail-form v-if="formVisible" />
    <detail-tabs size="1" />
  </mu-v-box>
</template>

<script>
  import dayjs from 'dayjs'
  import { confirm } from 'mussel'
  import { mapGetters } from 'vuex'

  import DetailForm from './form.vue'
  import DetailTabs from './detail-tabs.vue'

  // TODO:状态映射
  const StatusEnum = {
    done: '已完成',
    composing: '编制中',
    other: '请稍等'
  }

  export default {
    inject: ['application', 'context'],
    components: {
      DetailForm,
      DetailTabs
    },
    data () {
      return {
        formVisible: true
      }
    },
    computed: {
      ...mapGetters(['activeItem', 'editPermission']),
      title () {
        const { year, month } = this.activeItem
        return `${dayjs(`${year}-${month}`).format('YYYY 年 MM 月 ')}xxx期间统计`
      },
      status () {
        const status = this.activeItem?.status
        return StatusEnum[status]
      },
      disabled () {
        // 此处是对状态的条件判断  是更具当前的账单状态进行授权
        return true // this.editPermission && this.activeItem.state
      }
    },
    beforeRouteLeave (to, from, next) {
      const { editing } = this.$store.state.editingItem
      if (editing) {
        const { year, month } = this.activeItem
        this.$store.commit('setWarnBoxState', true)
        this.application.updateBreadcrumbsTitle('xxx统计')
        this.application.routerPush({
          name: 'detail',
          title: `${year}年${month}月xxx期间统计`,
          skipRoute: true
        })
      } else {
        next()
      }
    },
    methods: {
      async deleteItem () {
        confirm('是否删除本期统计', async btn => {
          if (btn === 'ok') {
            const { dispatch, commit } = this.$store
            const status = await dispatch('deleteItem')
            if (status) {
              dispatch('root/loadItems')
              this.application.routerGoIndex(0)
              commit('root/SET_ACTIVE_ITEM')
            }
          }
        })
      }
    }
  }
</script>
