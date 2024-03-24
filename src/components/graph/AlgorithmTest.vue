<template>
  <div class="home">
    <div style="margin-bottom: 10px">
      <div>
        <div>
          模式:
          <el-radio-group v-model="setColorMode">
            <el-radio label="1">最小路径扩散</el-radio>
            <el-radio label="2">树状层级扩散</el-radio>
          </el-radio-group>
        </div>
        <div>
          directed: <el-switch v-model="directed" @change="calculatePath" />
        </div>
        <div>
          start:
          <el-input
            v-model="startNodeId"
            style="width: 180px"
            @change="calculatePath"
          />
        </div>
        <div>
          end:
          <el-input
            v-model="endNodeId"
            style="width: 180px"
            @change="calculatePath"
          />
        </div>
        <div>shortedPath: {{ shortedPath }}</div>
        <div>allShortedPath: {{ allShortPath }}</div>
        <div>allPath: {{ allPath }}</div>
        <div>allCycles length: {{ allCycles.length }}</div>
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
import { cloneDeep, isEqual, maxBy, minBy } from "lodash-es";
// TODO: 异步停止问题
export default {
  name: "AlgorithmTest",
  data() {
    return {
      isPlaying: false,
      setColorMode: "2",
      startNodeId: "1",
      endNodeId: "6",
      shortedPath: [],
      allShortPath: [],
      allPath: [],
      allCycles: [],
      directed: false, // 边的方向性
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
        highlight: {
          fill: "#ed6969",
        },
        "highlight-blue": {
          fill: "blue",
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
    });

    this.graphData = SWITCH_DATA;
    this.graph.data(this.graphData);
    this.graph.render();

    this.graph.on("canvas:click", (e) => {
      this.stop();
    });

    this.calculatePath();
    /*
    const n1 = this.graph.findById("6");
    const edges = n1.getEdges();
    console.log(
      "//   ======start 1",
      edges.map((i) => i.getModel())
    );
    const $ = (id) => this.graph.findById(id);
    edges
      // .map((i) => i.getID())
      .forEach((item) => {
        const m = item.getModel();
        console.log("xx", item, m);

        item.setSource($(m.target));
        item.setTarget($(m.source));
        console.log("xx==", item, item.getModel());
        item.update({});
      });
    console.log(
      "//   ======start 2",
      edges.map((i) => i.getID())
    );*/
  },
  methods: {
    stop() {
      this.isPlaying = false;
      this.clearStates();
      // this.graph.render();
    },
    calculatePath() {
      const { findShortestPath, findAllPath, detectAllCycles } = G6.Algorithm;
      const shortPath = findShortestPath(
        this.graphData,
        this.startNodeId,
        this.endNodeId,
        this.directed
      );
      this.shortedPath = shortPath.path;
      this.allShortPath = shortPath.allPath;

      const allPath = findAllPath(
        this.graphData,
        this.startNodeId,
        this.endNodeId,
        this.directed
      );
      this.allPath = allPath || [];

      // this.allCycles = detectAllCycles(this.graphData, this.directed);
      // console.log(cloneDeep({ allPath, allCycles: this.allCycles }));
    },
    async runAnimate() {
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.clearStates();
      // 设置颜色动画
      switch (this.setColorMode) {
        case "1":
          await this.setColorByShort();
          break;
        case "2":
          await this.setColorByLoop({
            startId: this.startNodeId,
            endId: this.endNodeId,
            loop: true,
            loopIndex: 0,
          });
          break;
      }
      this.isPlaying = false;
    },
    setHull(node, newHull = false) {
      if (!this.isPlaying) return;

      const nodes = Array.isArray(node) ? node : [node];
      const ids = nodes.map((i) => i.getID());
      const hall = newHull ? this.blueHull : this.hull;
      if (hall) {
        hall.updateData([...ids, ...hall.members]);
      } else {
        this[newHull ? "blueHull" : "hull"] = this.graph.createHull({
          id: newHull ? "newHull" : "hull",
          type: "bubble",
          members: ids,
          padding: 10,
          style: newHull
            ? {
                fill: "blue",
                stroke: "blue",
              }
            : {
                fill: "#df5656",
                stroke: "#df5656",
              },
        });
      }
    },
    setHighlight(node, newHull = false) {
      if (!this.isPlaying) return;
      const nodes = Array.isArray(node) ? node : [node];
      nodes.forEach((i) => {
        this.graph.setItemState(
          i,
          newHull ? "highlight-blue" : "highlight",
          true
        );
      });
    },
    /**
     * 设置颜色
     * @param opt
     * @return {Promise<void>}
     */
    async setColorByLoop(opt) {
      if (!this.isPlaying) return;

      const {
        startId,
        endId,
        filterNodeId = [],
        loop = false,
        newHull = false,
      } = { ...opt };
      const { graph } = this;
      const visitedNode = {};
      const visitedEdge = {};
      const startNode = graph.findById(startId);

      const next = new Set([startNode]);
      let end = false;
      while (next.size > 0) {
        // 高亮包裹同一层级节点
        this.setHighlight([...next], newHull);
        this.setHull([...next], newHull);
        await sleep(1000);
        const temp = [...next];
        // 释放下一个队列
        next.clear();

        for (const node of temp) {
          const pId = node.getID();
          visitedNode[pId] = true;
          node.getEdges().forEach((edge) => {
            if (!visitedEdge[edge.getID()]) {
              this.graph.setItemState(
                edge,
                newHull ? "highlight-blue" : "highlight",
                true
              );
              edge.update({
                type: newHull ? "circle-running-1" : "circle-running",
                fillColor: newHull ? "blue" : "red",
                newHull,
              });
              // console.log("edge", edge);
              edge.refresh();
              visitedEdge[edge.getID()] = true;
            }
          });
          await sleep(1000);

          const neighbors = node.getNeighbors(/*"target"*/);
          /*
          // 虚假边
          for (const i of neighbors) {
            graph.addItem("edge", {
              source: pId,
              target: i.getID(),
              type: "circle-running",
              fillColor: newHull ? "blue" : "red",
            });
          }
          await sleep(1000);
*/

          for (const i of neighbors) {
            const id = i.getID();

            // TODO: 返回动画
            if (pId === endId && !end) {
              end = true;
              console.log(`到达最短路径`, endId);
              loop &&
                this.setColorByLoop({
                  endId: startId,
                  startId: endId,
                  loop: false,
                  newHull: true,
                });
            } else if (
              !next.has(id) &&
              !visitedNode[id] &&
              !filterNodeId.includes(id)
            ) {
              next.add(i);
            }
          }
        }
      }
    },
    async setColorByShort() {
      if (!this.isPlaying) return;

      const maxN = maxBy(this.allPath, function (o) {
        return o.length;
      }).length;
      const minN = minBy(this.allPath, function (o) {
        return o.length;
      }).length;
      console.log({ maxN, minN });
      const hullMembers = [this.startNodeId];
      if (this.hull) {
        this.hull.updateData(hullMembers);
      } else {
        this.hull = this.graph.createHull({
          id: "centerNode-hull",
          type: "bubble",
          members: hullMembers,
          padding: 10,
          style: {
            fill: "#df5656",
            stroke: "#df5656",
          },
        });
      }
      // 设置颜色
      // console.log("hull", this.hull);
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
          hullMembers.push(node.getID());
          this.graph.setItemState(node, "highlight", true);
        });
        // 更新轮廓
        this.hull && this.hull.updateData(hullMembers);
        // await sleep(1000);
        if (minN > i) {
          // 画线
          edges.forEach((edge) => {
            edge.update({ type: "circle-running" });
            this.graph.setItemState(edge, "highlight", true);
          });
        }

        await sleep(1000);
      }
    },
    clearStates() {
      const { graph } = this;
      if (this.hull) {
        graph.removeHull(this.hull);
        this.hull = undefined;
      }
      if (this.blueHull) {
        graph.removeHull(this.blueHull);
        this.blueHull = undefined;
      }
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
