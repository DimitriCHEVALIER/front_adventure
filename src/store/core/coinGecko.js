import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const coinGecko = {
  state: {
    listCoins: []
  },
  mutations: {
    SET_LIST_COINS(state, data) {
      state.listCoins = data;
    }
  },
  actions: {
    /** Requete pour Récupérer les valeures des tokens */
    async getAllCoins({ commit }) {
      const response = await Vue.axios.get("/get_coins_value");
      commit("SET_LIST_COINS", response.data);
      return response;
    }
  },
  getters: {
    getListCoins: state => state.listCoins
  }
};

export default coinGecko;
