import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const currency = {
  state: {
    currenciesReferentiel: []
  },
  mutations: {
    SET_CURRENCIES_REFERENTIEL(state, data) {
      state.currenciesReferentiel = data;
    }
  },
  actions: {
    /** Requete pour Récupérer toutes les devises */
    async getReferentielCurrencies({ commit }) {
      const response = await Vue.axios.get("/get_currencies_ref");
      commit("SET_CURRENCIES_REFERENTIEL", response.data);
      return response;
    },
    // eslint-disable-next-line no-empty-pattern
    async createCurrency({}, params) {
      return await Vue.axios.post("/create-currency", params);
    }
  },
  getters: {
    getCurrenciesReferentiel: state => state.currenciesReferentiel
  }
};

export default currency;
