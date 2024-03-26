<script>
import G6 from "@antv/g6";

export default {
  name: "GraphinVue",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.graph = new G6.Graph({
      container: this.$refs.container, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      width: 800, // Number，必须，图的宽度
      height: 500, // Number，必须，图的高度
      // enabledStack: true,
      plugins: [new G6.Grid() /*toolbar,*/],
      // layout: { type: "force" },
      // fitView: true,
      // fitViewPadding: [20, 40, 50, 20],
      animate: true,
      // linkCenter: true,
      defaultNode: {
        color: "lightgreen",
        style: {
          fill: "#90eebf",
          // opacity: 0.1,
          // fillOpacity: 0.9,
        },
        // size: 80,
        // style: {
        //   fontSize: 10,
        // },
      },
      defaultEdge: {
        // 去掉全局配置的 style
        // color: "#ed6969",
        // type: "circle-running",
        // type: "progress-edge",
        type: "cubic",
        labelCfg: {
          // 边上的标签文本配置
          autoRotate: true, // 边上的标签文本根据边的方向旋转
        },
        style: {
          endArrow: true,
          // startArrow: false,
          // lineDash: [120, 200],
        },
      },
      // linkCenter: true,
      modes: {
        // 允许拖拽画布、放缩画布、拖拽节点
        default: [
          {
            // type: "click-select",
          },
          "drag-canvas",
          "zoom-canvas",
          "drag-node",
          {
            type: "tooltip",
            formatText(model) {
              // console.log(model);
              // 提示框文本内容
              return `label: ${model.id}<br/>`;
            },
          },
          {
            type: "edge-tooltip", // 边提示框
            formatText(model) {
              // 边提示框文本内容
              return `source: ${model.source}<br/> target: ${model.target}<br/>`;
            },
          },
        ],
      },
      nodeStateStyles: {
        highlight: {
          fill: "#ed6969",
          opacity: 0.2,
        },
        "highlight-blue": {
          fill: "blue",
          stroke: "yellow",
        },
      },
      edgeStateStyles: {
        highlight: {
          stroke: "#ed6969",
        },
        "highlight-blue": {
          stroke: "blue",
        },
      },
      ...this.$props.options,
    });
    this.graph.data(this.$props.data);
    this.graph.render();
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.graph.data(val);
        this.graph.render();
      },
    },
  },
};
</script>

<template>
  <div ref="container"></div>
</template>

<style scoped lang="less"></style>
