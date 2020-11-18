import Vuex from 'vuex'

import getters from './getters'

// TODO ：修改引入文件名
import root from './modules/root'
import tab1 from './modules/tab1'
import tab2 from './modules/tab2'

const store = new Vuex.Store({
  modules: {
    root,
    tab1,
    tab2
  },
  getters
})

export default store
