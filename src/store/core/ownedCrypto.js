import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const ownedCrypto = {
  state: {
    ownedCryptos: []
  },
  mutations: {
    SET_OWNED_CRYPTOS(state, data) {
      state.ownedCryptos = data;
    }
  },
  actions: {
    // eslint-disable-next-line no-empty-pattern
    async getOwnedCryptosByPlatforme({ commit }, codePlateforme) {
      console.log(codePlateforme);
      const response = await Vue.axios.get(
        "/get_owned_crypto_by_platform/" + codePlateforme
      );
      if (response.status === 200) {
        commit("SET_OWNED_CRYPTOS", response.data);
      }
      return response;
    }
  },
  getters: {
    getOwnedCryptos: state => state.ownedCryptos
  }
};

export default ownedCrypto;
