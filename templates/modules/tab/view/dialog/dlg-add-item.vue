<template>
  <mu-dialog
    :visible="visible"
    :title="title"
    class="mu-flex-box"
    mask-action="none"
    width="400px"
    :buttons="buttons"
    @buttonclick="buttonclick"
    @change="change">
    <mu-form label-width="70px">
      <mu-form-field label="编制人">
        <mu-input readonly :value="context.userName" />
      </mu-form-field>
      <mu-form-field label="统计周期" :invalid="invalid">
        <mu-date-editor
          v-model="composingDate"
          language="zh"
          select-mode="month"
          @change="invalid = false" />
      </mu-form-field>
    </mu-form>
  </mu-dialog>
</template>

<script>
  import dayjs from 'dayjs'
  import { mapState } from 'vuex'

  import { error, notify } from 'mussel'

  /**
   * @template dlgAddItem
   * @description 新增弹窗
   */
  export default {
    name:"dlgAddItem",
    model: {
      prop: 'visible',
      event: 'change'
    },
    props: {
      title: String,
      visible: Boolean
    },
    inject: ['context', 'application'],
    data () {
      return {
        invalid: false,
        composingDate: null,
        buttons: [
          {
            key: 'ok',
            caption: '确定',
            buttonType: 'primary'
          },
          {
            key: 'cancel',
            caption: '取消'
          }
        ]
      }
    },
    computed: {
      ...mapState('root', {
        items (state) {
          return state.items
        }
      })
    },
    methods: {
      change (value) {
        this.$emit('change', value)
      },
      buttonclick (btn) {
        if (btn.key === 'ok') {
          this.save()
        } else {
          this.change(false)
        }
      },
      // 提交验证
      validate () {
        if (!this.composingDate) {
          error('请选择统计周期')
          return
        }

        // const isBefore = this.composingDate ? dayjs(this.composingDate).isAfter(new Date()) : ''
        // if (isBefore) {
        //   error('不允许建立后期xxx')
        //   return
        // }

        const d = dayjs(this.composingDate)
        const year = d.get('year')
        const month = d.get('month') + 1
        
        const composingItemExists = this.items.some(el => el.status !== 'done')
        if (composingItemExists) error('存在xxxx，不允许新增')
        return (item || composingItemExists) ? false : { year, month }
      },
      async save () {
        const { year, month } = Object(this.validate())
        const { dispatch, commit } = this.$store
        this.invalid = !year
        if (year) {
          const id = await dispatch('root/addItem', { year, month })
          if (id) {
            notify('success', '新增成功')
            this.change(false)
            // 新增成功刷新列表
            dispatch('root/loadItems')
            // 获取当前新增主表的详细信息
            const item = await dispatch('root/getItem', id)
            if (item) {
              this.application.routerPush({
                name: 'detail',
                title: `${item.year}年${item.month}月xxx期间统计`
              })
            }
          }
        }
      }
    }
  }
</script>
