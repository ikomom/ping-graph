<template>
  <div id="app">
    <nav>
      <router-link
        v-for="(route, index) in graphRoutes"
        :key="route.path"
        :to="route.path"
      >
        <span v-if="index" style="margin: 8px">|</span>
        {{ route.meta.title }}
      </router-link>
    </nav>
    <router-view />
  </div>
</template>
<script setup>
import { graphRoutes } from "@/utils/getRoute";
</script>
<style lang="less">
.g6-tooltip {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 12px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}
</style>
