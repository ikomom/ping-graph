import G6 from "@antv/g6";

G6.registerEdge(
  "line-growth",
  {
    afterDraw(cfg, group) {
      const shape = group.get("children")[0];
      const length = shape.getTotalLength();
      shape.animate(
        (ratio) => {
          // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
          const startLen = ratio * length;
          // Calculate the lineDash
          const cfg = {
            lineDash: [startLen, length - startLen],
          };
          return cfg;
        },
        {
          repeat: true, // Whether executes the animation repeatly
          duration: 2000, // the duration for executing once
        }
      );
    },
  },
  "cubic" // extend the built-in edge 'cubic'
);
