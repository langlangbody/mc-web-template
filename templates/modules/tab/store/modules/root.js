import baseUrlGen from '../base-url-gen'
const state = {
  permissions: [],
  activeItem: {},
  items: []
}

const mutations = {
  SET_PERMISSIONS: (states, params) => {
    states.permissions = params
  },
  SET_ITEMS: (states, params = []) => {
    states.items = params
  },
  SET_ACTIVE_ITEM: (states, params = {}) => {
    states.activeItem = params
  }
}

const actions = {
  // 加载主页列表信息
  loadItems ({ commit }, params) {
    return this.$http.get({
      url: `${baseUrlGen(this)}`
    }).then(res => {
      commit('SET_ITEMS', res)
    })
  },
  // 新增主表项
  addItem ({ commit }, params) {
    return this.$http.post({
      url: `${baseUrlGen(this)}`,
      params: params
    })
  },
  // 获取指定主表信息 params--> 选中项id
  getItem ({ commit }, params) {
    return this.$http.get({
      url: `${baseUrlGen(this)}/${params}`
    }).then(res => {
      commit('SET_ACTIVE_ITEM', res)
      return true
    })
  },
  deleteItem ({ commit }, params) {
    return this.$http.delete({
      url: `${baseUrlGen(this)}/${params}`
    }).then(res => {
      return !!res
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
