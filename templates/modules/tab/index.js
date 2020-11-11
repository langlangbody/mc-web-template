import Vue from 'vue'

import '../../include'

import store from './store'
import View from './view/index.vue'

const app = new Vue({
  store,
  render: h => h(View)
})
app.$mount('#app')
