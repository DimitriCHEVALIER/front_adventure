import Vue from "vue";
import Vuex from "vuex";
import FilesMapper from "@/Mappers/FilesMapper";
import LocalStorageUtils, { LIST_KEYS } from "@/Utils/LocalStorageUtils";

Vue.use(Vuex);

const dataFile = {
  state: {
    dataJoueurs: [],
    dataMap: null,
    responseOutput: null,
    listFiles: []
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
    },
    SET_LIST_FILES(state, data) {
      state.listFiles = data;
    }
  },
  actions: {
    /** Requete pour envoyer le fichier output */
    async GET_OUTPUT_FILE({ commit }, data) {
      const response = await Vue.axios.post(
        "https://127.0.0.1:8000/get_output_file",
        data
      );
      commit("SET_RESPONSE_OUTPUT", response);
      return response;
    },

    /** Requete pour récupérer le fichier input demandé */
    async GET_DATA_FILE({ commit }) {
      let filename = LocalStorageUtils.getItem(LIST_KEYS.SELECTED_FILE);
      console.log(filename);
      if (!filename) {
        filename = "config-peru.txt";
      }
      const response = await Vue.axios.get(
        "https://127.0.0.1:8000/get_input_file/" + filename
      );
      if (response.status === 200) {
        commit("SET_DATA_JOUEURS", response.data.joueurs);
        commit("SET_DATA_MAP", response.data.map);
      }
    },

    /** Requete pour récupérer tous les noms de fichiers input possible */
    async GET_ALL_FILES_NAMES({ commit }) {
      const response = await Vue.axios.get(
        "https://127.0.0.1:8000/get_list_input_file"
      );
      if (response.status === 200) {
        commit("SET_LIST_FILES", FilesMapper.map(response.data));
      }
      return response;
    }
  },
  getters: {
    getDataJoueurs: state => state.dataJoueurs,
    getDataMap: state => state.dataMap,
    getListFiles: state => state.listFiles
  }
};

export default dataFile;
