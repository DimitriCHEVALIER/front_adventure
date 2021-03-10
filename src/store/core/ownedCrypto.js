import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const ownedCrypto = {
  state: {
    ownedCryptos: [],
    beneficesCryptos: []
  },
  mutations: {
    SET_OWNED_CRYPTOS(state, data) {
      state.ownedCryptos = data;
    },
    SET_BENEFICES_CRYPTOS(state, data) {
      state.beneficesCryptos = data;
    }
  },
  actions: {
    async getOwnedCryptosByPlatforme({ commit }, codePlateforme) {
      console.log(codePlateforme);
      const response = await Vue.axios.get(
        "/get_owned_crypto_by_platform/" + codePlateforme
      );
      if (response.status === 200) {
        commit("SET_OWNED_CRYPTOS", response.data);
      }
      return response;
    },
    // eslint-disable-next-line no-empty-pattern
    async sellOwnedCrypto({}, params) {
      return await Vue.axios.post("/create-benefice", params);
    },
    async getBenefitsByPlatforme({ commit }, codePlateforme) {
      const response = await Vue.axios.get(
        "/get-benefice_by_plateforme/" + codePlateforme
      );
      if (response.status === 200) {
        commit("SET_BENEFICES_CRYPTOS", response.data);
      }
      return response;
    }
  },
  getters: {
    getOwnedCryptos: state => state.ownedCryptos,
    getBeneficesCryptos: state => state.beneficesCryptos
  }
};

export default ownedCrypto;
