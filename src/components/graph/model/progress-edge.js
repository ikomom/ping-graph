// 注册自定义边
import G6 from "@antv/g6";

G6.registerEdge(
  "progress-edge",
  {
    // 绘制边的逻辑
    draw: (cfg, group) => {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;

      const { style } = cfg;
      const shape = group.addShape("path", {
        attrs: {
          stroke: style.stroke,
          endArrow: style.endArrow,
          path: [
            ["M", startPoint.x, startPoint.y],
            ["L", startPoint.x, (startPoint.y + endPoint.y) / 2],
            ["L", endPoint.x, (startPoint.y + endPoint.y) / 2],
            ["L", endPoint.x, endPoint.y],
          ],
        },
      });

      return shape;
    },
  }
  // "line"
);

// 根据进度值获取边的颜色
function getEdgeColorByProgress(progress) {
  if (progress < 0.5) {
    return "#FFCC00"; // 进度小于 50% 的颜色
  } else {
    return "#00CC00"; // 进度大于等于 50% 的颜色
  }
}
