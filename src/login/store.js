/*
 * @Author: your name
 * @Date: 2019-10-21 13:51:08
 * @LastEditTime: 2019-10-31 11:41:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ysgz_webc:\developer\own-system\src\login\store.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    sessionId: "",
  },
  mutations: {
    upSessionId(state, newData) {
      state.sessionId = newData;
      console.log(newData)
    }
  },
  actions: {

  }
})
