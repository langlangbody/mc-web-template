<template>
  <mc-page>
    <router-view />
  </mc-page>
</template>

<script>
  import VueRouter from 'vue-router'

  import MainView from './main-view/index.vue'
  import DetailView from './detail-view/index.vue'

  const router = new VueRouter({
    routes: [
      { name: '/', path: '/', component: MainView },
      { name: 'detail', path: '/detail', component: DetailView }
    ]
  })

  export default {
    router
  }
</script>
