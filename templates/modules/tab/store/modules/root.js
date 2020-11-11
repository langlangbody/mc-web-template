const state = {
  permissions:[],
  activeItem: null,
  items: []
}

const mutations = {
  SET_PERMISSIONS: (state, params) => {
    state.permissions = permissions
  },
  SET_ITEMS: (state, params) => {
    state.items = param
  },
  SET_ACTIVE_ITEM: (state, params) => {
    state.activeItem = param
  }
}

const actions = {
  // 加载主页列表信息
  loadItems ({ commit }, params) {
    // return this.$http.get({
    //   url: `${baseUrlGen(this)}/roots`,
    //   params: params
    // }).then(res => {
    //   commit('SET_ITEMS', res)
    //   return true
    // })
  },
  // 新增主表项
  addItem ({ commit }, params) {
    // return this.$http.post({
    //   url: `${baseUrlGen(this)}/roots`,
    //   params: params
    // })
  },
  // 获取指定主表信息
  getItem ({ commit }, params) {
    // return this.$http.get({
    //   url: `${baseUrlGen(this)}/roots`,
    //   params: params
    // }).then(res => {
    //   commit('SET_ACTIVE_ITEM', res)
    //   return true
    // })
  },
  removeItem ({ commit }) {
    // return this.$http.delete({
    //   url: `${baseUrlGen(this)}/roots`
    // }).then(res => {
    //   return true
    // })
  },
  setActiveItem({ commit }, params) {
    commit('SET_ACTIVE_ITEM', params)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}