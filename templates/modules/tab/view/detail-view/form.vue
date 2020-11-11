<template>
  <mu-form
    form-style="table"
    label-align="left"
    label-width="130px"
    row-height="compact">
    <!-- <mu-form-row>
      <mu-form-field size="1" label="编制人" :value="activeItem.creatorName" />
      <mu-form-field size="1" label="编制日期" :value="activeItem.creatDate" />
      <mu-form-field size="1" label="金额" :value="activeItem.amount" />
    </mu-form-row> -->
    <mu-form-row>
      <mu-form-field size="1" label="编制人" value="xy" />
      <mu-form-field size="1" label="编制日期" value="9527" />
      <mu-form-field size="1" label="金额" value="ee" />
    </mu-form-row>
  </mu-form>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['activeItem'])
    }
  }
</script>
