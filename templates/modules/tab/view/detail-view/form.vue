<template>
  <mu-form
    form-style="table"
    label-align="left"
    label-width="130px"
    row-height="compact">
    <mu-form-row>
      <mu-form-field size="1" label="编制人" :value="activeItem.creator" />
      <mu-form-field size="1" label="编制日期" :value="activeItem.createTime" />
      <mu-form-field size="1" label="金额" :value="activeItem.amount" />
    </mu-form-row>
    <mu-form-row>
      <mu-form-field size="1" label="单位" :value="activeItem.unit" />
      <mu-form-field size="1" label="更新时间" :value="activeItem.updateTime" />
      <mu-form-field size="1" label="单价" :value="activeItem.unitPrice" />
    </mu-form-row>
    <mu-form-row>
      <mu-form-field size="1" label="规格" :value="activeItem.model" />
      <mu-form-field size="1" label="型号" :value="activeItem.type" />
      <mu-form-field size="1" />
    </mu-form-row>
  </mu-form>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['activeItem'])
    }
  }
</script>
