<template>
  <div class="home">
    <div style="margin-bottom: 10px">
      <el-button
        type="primary"
        :disabled="selectedNodeIds.length !== 2"
        @click="runAnimate()"
      >
        {{ isPlaying ? "playing" : "play" }}
      </el-button>
      {{ selectedNodeIds }}
    </div>
    <div id="mountNode"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import { sleep } from "@/utils/common";

function* loop(n) {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}

async function getMockData() {
  const data = await fetch(
    "https://gw.alipayobjects.com/os/bmw-prod/b0ca4b15-bd0c-43ec-ae41-c810374a1d55.json"
  ).then((res) => res.json());

  data.nodes.forEach((node) => {
    switch (node.index % 3) {
      case 0:
        node.type = "rect";
        node.size = 10; // class = 'c1' 时节点大小
        break;
      case 1:
        node.type = "circle"; // class = 'c1' 时节点图形为 rect
        break;
      case 2:
        node.type = "triangle"; // class = 'c2' 时节点图形为 ellipse
        node.size = 10; // class = 'c2' 时节点大小
        break;
    }
  });
  return data;
}

export default {
  name: "AnimatePath",
  data() {
    return {
      isPlaying: false,
      selectedNodeIds: [],
    };
  },
  async mounted() {
    this.graph = new G6.Graph({
      container: "mountNode", // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      width: 800, // Number，必须，图的宽度
      height: 500, // Number，必须，图的高度
      plugins: [new G6.Grid()],
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
        labelCfg: {
          // 边上的标签文本配置
          autoRotate: true, // 边上的标签文本根据边的方向旋转
        },
      },
      linkCenter: true,
      modes: {
        // 允许拖拽画布、放缩画布、拖拽节点
        default: [
          {
            type: "click-select",
          },
          "drag-canvas",
          "zoom-canvas" /* "drag-node"*/,
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

    const data = await getMockData();
    this.graphData = data;
    this.graph.data(data);
    this.graph.render();

    this.graph.on("node:click", (e) => {
      if (this.isPlaying) return;
      this.selectedNodeIds = this.graph
        .getNodes()
        .filter((node) => node.hasState("selected"))
        .map((node) => node.getID())
        .reverse();
      // const { item } = e;
      // const id = item.getID();
      // const index = this.selectedNodeIds.indexOf(id);
      // if (item.hasState("selected") && index < 0) {
      //   this.selectedNodeIds.push(id);
      // } else if (!item.hasState("selected")) {
      //   this.selectedNodeIds.splice(index, 1);
      // }
    });
    this.graph.on("canvas:click", (e) => {
      if (this.isPlaying) return;
      this.clearStates();
      this.selectedNodeIds = [];
    });
  },
  beforeDestroy() {
    this.graph.destroy();
  },
  methods: {
    async runAnimate() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.clearStates();
      const { findShortestPath } = G6.Algorithm;
      const { path, allPath, length } = findShortestPath(
        this.graphData,
        this.selectedNodeIds[0],
        this.selectedNodeIds[1],
        true
      );
      console.log({ path, allPath, length });
      if (path?.length) {
        const { graph } = this;
        const pathNodeMap = {};
        for (let i = 0; i < path.length; i++) {
          const id = path[i];
          const pathNode = graph.findById(id);
          // 元素设为顶层
          pathNode.toFront();
          console.log(pathNode);
          graph.setItemState(pathNode, "highlight", true);
          pathNodeMap[id] = true;

          await sleep(1500);
        }

        // graph.getEdges().forEach((edge) => {
        //   const edgeModel = edge.getModel();
        //   const source = edgeModel.source;
        //   const target = edgeModel.target;
        //   const sourceInPathIdx = path.indexOf(source);
        //   const targetInPathIdx = path.indexOf(target);
        //   if (sourceInPathIdx === -1 || targetInPathIdx === -1) return;
        //   if (Math.abs(sourceInPathIdx - targetInPathIdx) === 1) {
        //     graph.setItemState(edge, "highlight", true);
        //   } else {
        //     graph.setItemState(edge, "inactive", true);
        //   }
        // });
        // graph.getNodes().forEach((node) => {
        //   if (!pathNodeMap[node.getID()]) {
        //     graph.setItemState(node, "inactive", true);
        //   }
        // });
      } else {
        this.selectedNodeIds = [];
      }
      this.isPlaying = false;
    },
    clearStates() {
      const { graph } = this;
      graph.getNodes().forEach((node) => {
        graph.clearItemStates(node);
      });
      graph.getEdges().forEach((edge) => {
        graph.clearItemStates(edge);
      });
    },
  },
};
</script>
<style scoped lang="less">
#mountNode canvas {
  margin: 0 auto;
  border: 1px solid;
  background: #000;
}
</style>
