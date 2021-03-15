import Vue from "vue";
import Vuex from "vuex";
import plateforme from "./core/plateforme";
import currency from "./core/currency";
import order from "./core/order";
import ownedCrypto from "./core/ownedCrypto";
import coinGecko from "./core/coinGecko";

import VuexPersistence from "vuex-persist";

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage,
  modules: ["plateforme"]
});

export default new Vuex.Store({
  modules: {
    plateforme,
    currency,
    order,
    ownedCrypto,
    coinGecko
  },
  plugins: [vuexLocal.plugin]
});
