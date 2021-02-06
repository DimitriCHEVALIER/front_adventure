import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const dataFile = {
  state: {
    dataFile: []
  },
  mutations: {
    SET_DATA_FILE(state, data) {
      state.dataFile = data;
    }
  },
  actions: {
    async GET_DATA_FILE({ commit }) {
      const response = await Vue.axios.get(
        "https://127.0.0.1:8000/get_input_file"
      );
      commit("SET_DATA_FILE", response.data);
    }
  },
  getters: {
    getDataFile: state => state.dataFile
  }
};

export default dataFile;
