import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const order = {
  state: {},
  mutations: {},
  actions: {
    // eslint-disable-next-line no-empty-pattern
    async createOrder({}, params) {
      return await Vue.axios.post("/create-order", params);
    }
  },
  getters: {}
};

export default order;
