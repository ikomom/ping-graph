export const SWITCH_DATA = {
  nodes: [
    { id: "1", label: "1", x: 40, y: 80, type: "circle" },
    { id: "2", label: "2", x: 140, y: 80, type: "circle" },
    { id: "3", label: "3", x: 80, y: 180, type: "rect", size: [20, 20] },
    // { id: "4", label: "4", x: 200, y: 150, type: "triangle", size: 20 },
    { id: "5", label: "5", x: 260, y: 80, type: "ellipse", size: [20, 20] },
    { id: "6", label: "6", x: 260, y: 180, type: "diamond", size: [20, 20] },
    // { id: "7", label: "7", x: 140, y: 180, type: "hexagon", size: [20, 20] },
    // { id: "8", label: "8", x: 40, y: 150, type: "octagon", size: [20, 20] },
  ],
  edges: [
    { source: "1", target: "2", id: "12" },
    { source: "1", target: "3", id: "13" },
    { source: "1", target: "6", id: "16" },
    { source: "2", target: "5", id: "25" },
    { source: "5", target: "6", id: "56" },
    // { source: "4", target: "1" },
    // { source: "4", target: "5" },
    { source: "3", target: "6", id: "36" },
    // { source: "5", target: "2" },
    // { source: "5", target: "3" },
  ],
};
