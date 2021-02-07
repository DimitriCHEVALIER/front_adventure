import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const dataFile = {
  state: {
    dataJoueurs: [],
    dataMap: null,
    responseOutput: null
  },
  mutations: {
    SET_DATA_MAP(state, data) {
      state.dataMap = data;
    },
    SET_DATA_JOUEURS(state, data) {
      state.dataJoueurs = data;
    },
    SET_RESPONSE_OUTPUT(state, data) {
      state.responseOutput = data;
    }
  },
  actions: {
    async GET_OUTPUT_FILE({ commit }, data) {
      const response = await Vue.axios.post(
        "https://127.0.0.1:8000/get_output_file",
        data
      );
      commit("SET_RESPONSE_OUTPUT", response);
      console.log(response);
    },
    async GET_DATA_FILE({ commit }) {
      const response = await Vue.axios.get(
        "https://127.0.0.1:8000/get_input_file"
      );
      if (response.status === 200) {
        commit("SET_DATA_JOUEURS", response.data.joueurs);
        commit("SET_DATA_MAP", response.data.map);
      }
    }
  },
  getters: {
    getDataJoueurs: state => state.dataJoueurs,
    getDataMap: state => state.dataMap
  }
};

export default dataFile;
