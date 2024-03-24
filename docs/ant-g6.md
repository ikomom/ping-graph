- [点击单选或多选](https://g6.antv.antgroup.com/examples/interaction/select#click)
- [无到有的边(动画)](https://g6.antv.antgroup.com/examples/scatter/edge#lineGrowth)
- [圆点沿边运动](https://g6.antv.antgroup.com/examples/scatter/edge#pointInLine)
- [最短路径](https://g6.antv.antgroup.com/examples/algorithm/algoDemos#shortestPath)
- [聚类包裹](https://g6.antv.antgroup.com/api/graph-func/hull#removehullhull-string--hull)
- [用轮廓包裹节点集合](https://g6.antv.antgroup.com/examples/interaction/hull/#hull)
- [切换节点图片](https://g6.antv.antgroup.com/examples/interaction/label#changeImg)
- [边上添加额外图形](https://g6.antv.antgroup.com/examples/item/customEdge#extraShape)
- [toolbar【redo, undo, zoom】](https://github.com/antvis/G6/blob/master/packages/plugin/src/toolBar/index.ts#L208)
- [扩展现有边](https://g6.antv.antgroup.com/manual/middle/elements/edges/custom-edge)



## 需求

不同类型**交换机**，每个交换机代表一个节点，两两中的连线代表一个交换机向另一个发送ping请求的过程

交换机类型有3个；每个交换机下还有用户机；每个交换机上有监控点。



假设有三个场景

### 场景1

默认所有节点都是绿色

选择两个节点，算出最短路径

1. 从起始节点播放动画，圆球沿着所有子节点边运动，运动后节点变红
2. 沿着最短路径，运动到结束节点，往回播放动画，也沿着所有子节点运动，节点变蓝
3. 到达起始节点结束，其他子边的动画还在播放



节点运动动画需要有轮廓

1. 红色（一开始）
2. 蓝色（回来时）

### 场景2

在一的基础上，等圆球动画到达结束节点时，再从开始节点发送圆球，两者碰到，停止动画

### 场景3

在二的基础上，两个动画停止运动时，再从开始节点发送圆球，碰到后让僵持圆球继续走



- 提前准备好数据，边要双向的

- 确认是否扩散？



## demo

### 多条边

```js
import G6 from "@antv/g6";

const edgeTypeColorMap = {
  type1: ["#531dab", "#391085", "#391085"],
  type2: ["#d9d9d9", "#bfbfbf", "#8c8c8c"],
  type3: ["#d3adf7", "#b37feb", "#9254de"]
};

const defaultConf = {
  style: {
    lineAppendWidth: 5,
    lineDash: [0, 0],
    lineDashOffset: 0,
    opacity: 1,
    labelCfg: {
      style: {
        fillOpacity: 1
      }
    }
  },
  /**
   * 绘制边
   * @override
   * @param  {Object} cfg   边的配置项
   * @param  {G.Group} group 边的容器
   * @return {G.Shape} 图形
   */
  drawShape(cfg, group) {
    const item = group.get("item");
    const shapeStyle = this.getShapeStyle(cfg, item);
    const shape = group.addShape("path", {
      className: "edge-path",
      attrs: shapeStyle
    });
    return shape;
  },
  drawLabel(cfg, group) {
    const labelCfg = cfg.labelCfg || {};
    const labelStyle = this.getLabelStyle(cfg, labelCfg, group);
    const text = group.addShape("text", {
      attrs: {
        ...labelStyle,
        text: cfg.label,
        fontSize: 12,
        fill: "#404040",
        cursor: "pointer"
      },
      className: "edge-label"
    });

    return text;
  },

  /**
   * 获取图形的配置项
   * @internal 仅在定义这一类节点使用，用户创建和更新节点
   * @param  {Object} cfg 节点的配置项
   * @return {Object} 图形的配置项
   */
  getShapeStyle(cfg, item) {
    const { startPoint, endPoint } = cfg;
    const type = item.get("type");

    const defaultStyle = this.getStateStyle("default", true, item);

    if (type === "node") {
      return Object.assign({}, cfg.style, defaultStyle);
    }

    const controlPoints = this.getControlPoints(cfg);
    let points = [startPoint]; // 添加起始点
    // 添加控制点
    if (controlPoints) {
      points = points.concat(controlPoints);
    }
    // 添加结束点
    points.push(endPoint);
    const path = this.getPath(points);

    const style = Object.assign({}, { path }, cfg.style, defaultStyle);
    return style;
  },
  getControlPoints(cfg) {
    let controlPoints = cfg.controlPoints; // 指定controlPoints

    if (!controlPoints || !controlPoints.length) {
      const { startPoint, endPoint } = cfg;
      const innerPoint = G6.Util.getControlPoint(
        startPoint,
        endPoint,
        0.5,
        cfg.edgeOffset || 30
      );
      controlPoints = [innerPoint];
    }
    return controlPoints;
  },
  /**
   * 获取三次贝塞尔曲线的path
   *
   * @param {array} points 起始点和两个控制点
   * @returns
   */
  getPath(points) {
    const path = [];
    path.push(["M", points[0].x, points[0].y]);
    path.push(["Q", points[1].x, points[1].y, points[2].x, points[2].y]);
    return path;
  },
  /**
   * 根据不同状态，获取不同状态下的样式值
   * @param {string} name
   * @param {string} value
   * @param {Item} item
   */
  getStateStyle(name, value, item) {
    const model = item.getModel();
    const { style = {} } = model;

    const defaultStyle = Object.assign({}, this.style);

    // 更新颜色
    return {
      ...defaultStyle,
      lineWidth: 1,
      stroke:
        edgeTypeColorMap[model.edgeType] && edgeTypeColorMap[model.edgeType][0],
      ...style
    };
  }
};

G6.registerEdge("quadratic-label-edge", defaultConf, "quadratic");

const INNER_CIRCLE_CLASS = "node-inner-circle";
const GRAPH_CONTAINER = "container";
const data = {
  nodes: [
    {
      id: "node1",
      x: 100,
      y: 150,
      label: "node1"
    },
    {
      id: "node2",
      x: 300,
      y: 150,
      label: "node2"
    }
  ],
  edges: [
    {
      source: "node1",
      target: "node2",
      edgeType: "type1"
    },
    {
      source: "node2",
      target: "node1",
      edgeType: "type2"
    },
    {
      source: "node2",
      target: "node1",
      edgeType: "type3",
      edgeOffset: -20
    }
  ]
};

const width = document.getElementById("container").scrollWidth;
const height = document.getElementById("container").scrollHeight || 500;
const graph = new G6.Graph({
  container: GRAPH_CONTAINER,
  width,
  height,
  modes: {
    default: [
      {
        type: "drag-node",
        delegate: false
      }
    ]
  },
  defaultNode: {
    style: {
      fill: "#DEE9FF",
      stroke: "#5B8FF9"
    },
    labelCfg: {
      style: {
        fontSize: 12
      }
    }
  },
  defaultEdge: {
    type: "quadratic-label-edge"
  }
});

graph.data(data);
graph.render();

```



