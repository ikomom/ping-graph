<script setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { onMounted, ref } from "vue";
const mapRef = ref();

onMounted(() => {
  const map = L.map(mapRef.value, {
    // renderer: L.Renderer,
  }).setView([51.505, -0.09], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
});
</script>

<template>
  <div>
    <div ref="mapRef" id="leaflet-map">Map</div>
  </div>
</template>

<style scoped lang="less">
#leaflet-map {
  height: 300px;
}
</style>
