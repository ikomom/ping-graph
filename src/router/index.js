import Vue from "vue";
import VueRouter from "vue-router";
import { graphRoutes } from "@/utils/getRoute";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "home",
    redirect: graphRoutes[0].path,
    // component: HomeView,
  },
  ...graphRoutes,
];

const router = new VueRouter({
  routes,
});

export default router;
