import Vue from "vue";
import VueRouter from "vue-router";
import HomeCrypto from "../views/HomeCrypto.vue";
import Plateforme from "../views/Plateforme.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeCrypto
  },
  {
    path: "/plateforme",
    name: "plateforme",
    component: Plateforme
  }
];

const router = new VueRouter({
  routes
});

export default router;
