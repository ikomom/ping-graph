import Vue from "vue";
import VueRouter from "vue-router";
import { graphRoutes } from "@/utils/getRoute";

Vue.use(VueRouter);
const routes = [...graphRoutes];

const router = new VueRouter({
  routes,
});

export default router;
