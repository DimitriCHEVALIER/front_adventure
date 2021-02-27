import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const dataFile = {
  state: {
    plateformes: [],
    plateforme: null,
    plateformeReferentiels: []
  },
  mutations: {
    SET_PLATEFORMES(state, data) {
      state.plateformes = data;
    },
    SET_PLATEFORME(state, data) {
      state.plateforme = data;
    },
    SET_PLATEFORMES_REFERENTIELS(state, data) {
      state.plateformeReferentiels = data;
    }
  },
  actions: {
    /** Requete pour Récupérer toutes les plateformes */
    async getAllPlateformes({ commit }) {
      const response = await Vue.axios.get("/get_plateformes");
      commit("SET_PLATEFORMES", response.data);
      return response;
    },
    async getPlateforme({ commit }, code) {
      const response = await Vue.axios.get("/get_plateforme/" + code);
      commit("SET_PLATEFORME", response.data);
      return response;
    },

    async getPlateformesReferentiels({ commit }) {
      const response = await Vue.axios.get("/get_plateformes_referentiels/");
      commit("SET_PLATEFORMES_REFERENTIELS", response.data);
      console.log(response);
      return response;
    }
  },
  getters: {
    getPlateformes: state => state.plateformes,
    getPlateformeReferentiels: state => state.plateformeReferentiels,
    getPlateforme: state => state.plateforme
  }
};

export default dataFile;
