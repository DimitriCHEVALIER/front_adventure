import Vue from "vue";
import Vuex from "vuex";
import dataFile from "./core/dataFile";
import plateforme from "./core/plateforme";
import currency from "./core/currency";
import order from "./core/order";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    dataFile,
    plateforme,
    currency,
    order
  }
});
