import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import PeruHomepage from "../views/PeruHomepage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
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
