import baseUrlGen from '../base-url-gen'

const state = {
  items: []
}

const mutations = {
  SET_ITEMS: (states, params) => {
    states.items = params
  }
}

const actions = {
  loadItems ({ commit }, params) {
    return this.$http.get({
      url: `${baseUrlGen(this)}/params/tab1`,
      params: params
    }).then(res => {
      commit('SET_ITEMS', res)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
