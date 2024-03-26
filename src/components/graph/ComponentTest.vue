<script>
import GraphinVue from "@/components/graph/components/GraphinVue.vue";
import { SWITCH_DATA } from "@/components/graph/data/graph";

export default {
  name: "ComponentTest",
  computed: {
    SWITCH_DATA() {
      return SWITCH_DATA;
    },
  },
  components: { GraphinVue },
};
</script>

<template>
  <div>
    <GraphinVue :data="SWITCH_DATA" />
  </div>
</template>

<style scoped lang="less"></style>
