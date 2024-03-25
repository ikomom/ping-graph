<template>
  <div class="home">
    <div style="margin-bottom: 10px">//</div>
    <div id="mountNode"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import { SWITCH_DATA } from "@/components/graph/data/graph";
import "./model/circle-runing";
import "./model/progress-edge";
export default {
  name: "ItemTest",
  data() {
    return {};
  },
  async mounted() {
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
    });

    this.graphData = SWITCH_DATA;
    this.graph.data(this.graphData);
    this.graph.render();

    this.graph.on("click", (e) => {
      const item = e.item;
      if (item) {
        const id = item.getID();
        const container = item.getContainer();
        // 关键图形
        const keyShape = item.getKeyShape();
        const model = item.getModel();

        item.toBack();
        // 关联节点不更新
        item.updatePosition({ x: model.x + 15, y: model.y + 15 });
        // item.clearCache();
        // item.enableCapture(false);
        item.getEdges().forEach((edge) => {
          edge.refresh();
        });

        const text = container.addShape("text", {
          attrs: {
            text: "test text",
            x: 0,
            y: 10,
            fontSize: 14,
            textAlign: "left",
            textBaseline: "middle",
            fill: "#0000D9",
          },
          // 在 G6 3.3 及之后的版本中，必须指定 name，可以是任意字符串，但需要在同一个自定义元素类型中保持唯一性
          name: "text-shape",
        });

        /*   setTimeout(() => {
          text.rotate(-Math.PI / 2);
        }, 1000);
*/
        // item.hide();// 隐藏本身
        // this.graph.hideItem(item);//隐藏本身+关联节点
        // state会叠加
        item.setState("highlight", true);
        item.setState("highlight-blue", true);
        const states = item.getStates();
        const style = item.getStateStyle("highlight-blue");
        // console.log(item.getStateStyle("selected"));
        console.log(
          {
            id,
            keyShape,
            model,
            states,
            style,
            styleCur: item.getCurrentStatesStyle(),
            styleOrigin: item.getOriginStyle(),
          },
          { parent: container.getParent(), children: container.getChildren() }
        );
        // const matrix = this.graph.getAdjMatrix();
        // console.log({ matrix });
      }
    });
  },
  methods: {},
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
