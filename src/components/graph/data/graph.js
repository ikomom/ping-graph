import { isEqual, uniqWith } from "lodash-es";

const SWITCH_DATA = {
  nodes: [
    { id: "1", label: "1", x: 40, y: 80, type: "circle" },
    { id: "2", label: "2", x: 140, y: 80, type: "circle" },
    { id: "3", label: "3", x: 80, y: 180, type: "rect", size: [20, 20] },
    // { id: "4", label: "4", x: 200, y: 150, type: "triangle", size: 20 },
    { id: "5", label: "5", x: 260, y: 80, type: "ellipse", size: [20, 20] },
    { id: "6", label: "6", x: 260, y: 180, type: "diamond", size: [20, 20] },
    { id: "7", label: "7", x: 340, y: 80, type: "hexagon", size: [20, 20] },
    { id: "8", label: "8", x: 440, y: 150, type: "octagon", size: [20, 20] },
    { id: "9", label: "9", x: 440, y: 340, type: "circle" },
  ],
  edges: [
    { source: "1", target: "2", id: "12" },
    { source: "1", target: "3", id: "13" },
    { source: "1", target: "6", id: "16" },
    { source: "2", target: "5", id: "25" },
    { source: "2", target: "6", id: "26" },
    { source: "5", target: "6", id: "56" },
    { source: "3", target: "6", id: "36" },
    { source: "5", target: "7", id: "57" },
    { source: "6", target: "8", id: "68" },
    { source: "6", target: "9", id: "69" },
  ],
};

/*SWITCH_DATA.edges = generateEdges(SWITCH_DATA.nodes, false);
function generateEdges(nodes, isDirected) {
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i !== j) {
        // 确保节点不与自己连接
        edges.push({ source: nodes[i].id, target: nodes[j].id });
        if (!isDirected) {
          // 如果图是无向的，添加反向边
          edges.push({ source: nodes[j].id, target: nodes[i].id });
        }
      }
    }
  }
  return uniqWith(edges, isEqual);
}
console.log({ SWITCH_DATA });*/
export { SWITCH_DATA };
