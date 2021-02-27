import Vue from "vue";
import VueRouter from "vue-router";
import HomeCrypto from "../views/HomeCrypto.vue";
import PeruHomepage from "../views/PeruHomepage.vue";
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
  },
  {
    path: "/peru-homepage",
    name: "peru-homepage",
    component: PeruHomepage
  }
];

const router = new VueRouter({
  routes
});

export default router;
