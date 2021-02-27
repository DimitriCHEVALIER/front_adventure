import Vue from "vue";
import Vuex from "vuex";
import dataFile from "./core/dataFile";
import plateforme from "./core/plateforme";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    dataFile,
    plateforme
  }
});
