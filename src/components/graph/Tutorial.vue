<template>
  <div class="home">
    <div id="mountNode"></div>
  </div>
</template>

<script setup>
import G6 from "@antv/g6";
import { onBeforeUnmount, onMounted } from "vue";
// 实例化 minimap 插件
const minimap = new G6.Minimap({
  size: [100, 100],
  className: "minimap",
  type: "keyShape",
});
// 实例化 Image Minimap 插件
const imageMinimap = new G6.ImageMinimap({
  width: 200,
  graphImg:
    "https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*eD7nT6tmYgAAAAAAAAAAAABkARQnAQ",
});
const data = {
  // 点集
  nodes: [
    {
      id: "node1", // 节点的唯一标识
      x: 100, // 节点横坐标
      y: 200, // 节点纵坐标
      label: "起始点", // 节点文本
    },
    {
      id: "node2",
      x: 300,
      y: 200,
      label: "目标点",
    },
  ],
  // 边集
  edges: [
    // 表示一条从 node1 节点连接到 node2 节点的边
    {
      source: "node1", // 起始点 id
      target: "node2", // 目标点 id
      label: "我是连线", // 边的文本
    },
  ],
};

onMounted(() => {
  const graph = new G6.Graph({
    container: "mountNode", // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    width: 800, // Number，必须，图的宽度
    height: 500, // Number，必须，图的高度
    // plugins: [minimap, imageMinimap, new G6.Grid()],
    // layout: {
    //   // Object，可选，布局的方法及其配置项，默认为 random 布局。
    //   type: "force", // 指定为力导向布局
    //   preventOverlap: true, // 防止节点重叠
    //   center: [200, 200], // 可选，默认为图的中心
    //   linkDistance: 50, // 可选，边长
    //   nodeStrength: 30, // 可选
    //   edgeStrength: 0.08, // 可选
    //   collideStrength: 0.9, // 可选
    //   nodeSize: 30, // 可选
    //   alpha: 0.3, // 可选
    //   alphaDecay: 0.028, // 可选
    //   alphaMin: 0.01, // 可选
    //   forceSimulation: null, // 可选
    //   onTick: () => {
    //     // 可选
    //     console.log("ticking");
    //   },
    //   onLayoutEnd: () => {
    //     // 可选
    //     console.log("force layout done");
    //   },
    //   // nodeSize: 30        // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
    // },
    // fitView: true,
    // fitViewPadding: [20, 40, 50, 20],
    animate: true,
    defaultNode: {
      size: 2,
      style: {
        fill: "#C6E5FF",
        stroke: "#5B8FF9",
        lineWidth: 0.3,
      },
      labelCfg: {
        style: {
          fontSize: 3,
        },
        position: "right",
        offset: 1,
      },
    },
    defaultEdge: {
      size: 0.1,
      color: "#333",
      opacity: 0.2,
    },
    nodeStateStyles: {
      selected: {
        fill: "steelblue",
        stroke: "#000",
        lineWidth: 1,
      },
    },
    modes: {
      // 允许拖拽画布、放缩画布、拖拽节点
      default: [
        {
          type: "zoom-canvas",
          enableOptimize: true,
          optimizeZoom: 0.9,
        },
        {
          type: "drag-canvas",
          enableOptimize: true,
        },
        {
          type: "tooltip",
          formatText(model) {
            console.log(model);
            // 提示框文本内容
            const text =
              "label: " + model.label + "<br/> class: " + model.class;
            return text;
          },
        },
        {
          type: "edge-tooltip", // 边提示框
          formatText(model) {
            // 边提示框文本内容
            const text =
              "source: " +
              model.source +
              "<br/> target: " +
              model.target +
              "<br/> weight: " +
              model.weight;
            return text;
          },
        },
      ],
    },
    // nodeStateStyles: {
    //   // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
    //   hover: {
    //     fill: "lightsteelblue",
    //   },
    //   // 鼠标点击节点，即 click 状态为 true 时的样式
    //   click: {
    //     stroke: "#000",
    //     lineWidth: 3,
    //   },
    // },
    // 边不同状态下的样式集合
    edgeStateStyles: {
      hover: {
        stroke: "lightsteelblue",
      },
      // 鼠标点击边，即 click 状态为 true 时的样式
      click: {
        stroke: "yellow",
      },
    },
  });
  graph.data(data); // 读取 Step 2 中的数据源到图上
  graph.render(); // 渲染图

  const main = async () => {
    const response = await fetch(
      // "https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json"
      "https://gw.alipayobjects.com/os/bmw-prod/f1565312-d537-4231-adf5-81cb1cd3a0e8.json"
    );
    const remoteData = await response.json();
    const nodes = remoteData.nodes;
    console.log("before", JSON.parse(JSON.stringify(nodes)));
    nodes.forEach((node) => {
      if (!node.style) {
        node.style = {};
      }
      switch (
        node.class // 根据节点数据中的 class 属性配置图形
      ) {
        case "c0": {
          node.type = "circle"; // class = 'c0' 时节点图形为 circle
          break;
        }
        case "c1": {
          node.type = "rect"; // class = 'c1' 时节点图形为 rect
          node.size = [35, 20]; // class = 'c1' 时节点大小
          break;
        }
        case "c2": {
          node.type = "ellipse"; // class = 'c2' 时节点图形为 ellipse
          node.size = [35, 20]; // class = 'c2' 时节点大小
          break;
        }
      }
    });
    console.log("after", JSON.parse(JSON.stringify(nodes)));

    const edges = remoteData.edges;
    edges.forEach((edge) => {
      if (!edge.style) {
        edge.style = {};
      }
      edge.style.opacity = 0.6;
      edge.style.stroke = "red";
      edge.style.lineWidth = edge.weight; // 边的粗细映射边数据中的 weight 属性数值
    });

    graph.data(remoteData); // 加载远程数据
    graph.render(); // 渲染
  };
  main();

  // 鼠标进入节点
  graph.on("node:mouseenter", (e) => {
    const nodeItem = e.item; // 获取鼠标进入的节点元素对象
    graph.setItemState(nodeItem, "hover", true); // 设置当前节点的 hover 状态为 true
  });

  // 鼠标离开节点
  graph.on("node:mouseleave", (e) => {
    const nodeItem = e.item; // 获取鼠标离开的节点元素对象
    graph.setItemState(nodeItem, "hover", false); // 设置当前节点的 hover 状态为 false
  });
  // 鼠标进入节点
  graph.on("edge:mouseenter", (e) => {
    const nodeItem = e.item; // 获取鼠标进入的节点元素对象
    graph.setItemState(nodeItem, "hover", true); // 设置当前节点的 hover 状态为 true
  });

  // 鼠标离开节点
  graph.on("edge:mouseleave", (e) => {
    const nodeItem = e.item; // 获取鼠标离开的节点元素对象
    graph.setItemState(nodeItem, "hover", false); // 设置当前节点的 hover 状态为 false
  });

  // 点击节点
  graph.on("node:click", (e) => {
    // 先将所有当前是 click 状态的节点置为非 click 状态
    const clickNodes = graph.findAllByState("node", "click");
    clickNodes.forEach((cn) => {
      graph.setItemState(cn, "click", false);
    });
    const nodeItem = e.item; // 获取被点击的节点元素对象
    graph.setItemState(nodeItem, "click", true); // 设置当前节点的 click 状态为 true
  });

  // 点击边
  graph.on("edge:click", (e) => {
    // 先将所有当前是 click 状态的边置为非 click 状态
    const clickEdges = graph.findAllByState("edge", "click");
    clickEdges.forEach((ce) => {
      graph.setItemState(ce, "click", false);
    });
    const edgeItem = e.item; // 获取被点击的边元素对象
    graph.setItemState(edgeItem, "click", true); // 设置当前边的 click 状态为 true
  });
  onBeforeUnmount(() => {
    graph.destroy();
  });
});
</script>
<style lang="less">
canvas {
  margin: 0 auto;
  border: 1px solid;
}
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
