<template>
  <div class="home">
    <div style="margin-bottom: 10px">
      <div>
        <div>start: {{ startNodeId }}</div>
        <div>end: {{ endNodeId }}</div>
        <div>shortedPath: {{ shortedPath }}</div>
        <div>allShortedPath: {{ allShortPath }}</div>
        <div>allPath: {{ allPath }}</div>
      </div>
      <el-button type="primary" :disabled="isPlaying" @click="runAnimate()">
        {{ isPlaying ? "playing" : "play" }}
      </el-button>
      <el-button type="danger" @click="stop()">stop</el-button>
    </div>
    <div id="mountNode"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import { sleep } from "@/utils/common";
import { SWITCH_DATA } from "@/components/graph/data/graph";
import "./model/circle-runing";
import "./model/progress-edge";
import { maxBy, minBy } from "lodash-es";
export default {
  name: "AlgorithmTest",
  data() {
    return {
      isPlaying: false,
      startNodeId: "1",
      endNodeId: "6",
      shortedPath: [],
      allShortPath: [],
      allPath: [],
    };
  },
  async mounted() {
    const toolbar = new G6.ToolBar({
      container: document.getElementById("mountNode"),
      //   getContent: () => {
      //     return `
      //   <ul>
      //     <li code='add'>增加节点</li>
      //     <li code='undo'>撤销</li>
      //   </ul>
      // `;
      //   },
      //   handleClick: (code, graph) => {
      //     if (code === "add") {
      //       graph.addItem("node", {
      //         id: "node2",
      //         label: "node2",
      //         x: 300,
      //         y: 150,
      //       });
      //     } else if (code === "undo") {
      //       // 自定义 undo
      //       toolbar.undo();
      //       toolbar.autoZoom();
      //     } else {
      //       // 其他操作保持默认不变
      //       toolbar.handleDefaultOperator(code);
      //     }
      //   },
    });

    this.graph = new G6.Graph({
      container: "mountNode", // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      width: 800, // Number，必须，图的宽度
      height: 500, // Number，必须，图的高度
      // enabledStack: true,
      plugins: [new G6.Grid() /*toolbar,*/],
      // layout: { type: "force" },
      // fitView: true,
      // fitViewPadding: [20, 40, 50, 20],
      animate: true,
      defaultNode: {
        color: "lightgreen",
        style: {
          fill: "#90eebf",
        },
        // size: 80,
        // style: {
        //   fontSize: 10,
        // },
      },
      defaultEdge: {
        // 去掉全局配置的 style
        // color: "red",
        // type: "circle-running",
        // type: "progress-edge",
        type: "cubic",
        labelCfg: {
          // 边上的标签文本配置
          autoRotate: true, // 边上的标签文本根据边的方向旋转
        },
        style: {
          endArrow: true,
          startArrow: false,
        },
      },
      // linkCenter: true,
      modes: {
        // 允许拖拽画布、放缩画布、拖拽节点
        default: [
          {
            type: "click-select",
          },
          "drag-canvas",
          "zoom-canvas",
          // "drag-node",
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
        selected: {
          // fill: "red",
        },
        highlight: {
          fill: "red",
        },
      },
    });

    this.graphData = SWITCH_DATA;
    this.graph.data(this.graphData);
    this.graph.render();

    this.graph.on("canvas:click", (e) => {
      this.clearStates();
    });

    const { findShortestPath, findAllPath } = G6.Algorithm;
    const shortPath = findShortestPath(
      this.graphData,
      this.startNodeId,
      this.endNodeId,
      true
    );
    this.shortedPath = shortPath.path;
    this.allShortPath = shortPath.allPath;

    const allPath = findAllPath(
      this.graphData,
      this.startNodeId,
      this.endNodeId,
      true
    );
    this.allPath = allPath || [];
    console.log({ allPath });

    //   ============start
    const n1 = this.graph.findById("5");
    console.log(n1.getOutEdges().map((i) => i.getID()));
  },
  methods: {
    stop() {
      this.isPlaying = false;
      this.clearStates();
    },
    async runAnimate() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.clearStates();
      const maxN = maxBy(this.allPath, function (o) {
        return o.length;
      }).length;
      const minN = minBy(this.allPath, function (o) {
        return o.length;
      }).length;
      console.log({ maxN, minN });

      for (let i = 0; i < maxN; i++) {
        if (!this.isPlaying) return;
        const nodes = new Set();
        const edges = new Set();

        for (const path of this.allPath) {
          if (path[i]) {
            const node = this.graph.findById(path[i]);
            nodes.add(node);
            node.getOutEdges().forEach((e) => {
              edges.add(e);
            });
          }
        }
        console.log(
          i,
          [...nodes].map((i) => i.getID()),
          [...edges].map((i) => i.getID())
        );
        // 画点
        nodes.forEach((node) => {
          this.graph.setItemState(node, "active", true);
        });

        // await sleep(1000);
        // 画线
        edges.forEach((edge) => {
          edge.update({ type: "circle-running" });
          this.graph.setItemState(edge, "active", true);
        });

        await sleep(1000);
      }

      this.isPlaying = false;
    },
    clearStates() {
      const { graph } = this;
      graph.getNodes().forEach((node) => {
        graph.clearItemStates(node);
      });
      graph.getEdges().forEach((edge) => {
        edge.update({ type: "cubic" });
        graph.clearItemStates(edge);
      });
    },
  },
  beforeDestroy() {
    this.graph.destroy();
  },
};
</script>
<style scoped lang="less">
#mountNode {
  position: relative;
}
canvas {
  margin: 0 auto;
  border: 1px solid;
}
</style>
