import G6 from "@antv/g6";

G6.registerEdge(
  "circle-running",
  {
    afterDraw(cfg, group) {
      // get the first shape in the group, it is the edge's path here=
      const { fillColor, newHull } = cfg;
      const shape = group.get("children")[0];
      // the start position of the edge's path
      const startPoint = shape.getPoint(0);

      // add red circle shape
      const circle = group.addShape("circle", {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: fillColor,
          r: 3,
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "circle-shape",
      });

      newHull && console.log("afterDrawer", circle);
      // animation for the red circle
      circle.animate(
        (ratio) => {
          // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
          // get the position on the edge according to the ratio
          const tmpPoint = shape.getPoint(ratio);
          // returns the modified configurations here, x and y here
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        },
        {
          repeat: false, // Whether executes the animation repeatly
          duration: 1000, // the duration for executing once
        }
      );
      return circle;
    },
  },
  "cubic" // extend the built-in edge 'cubic'
);

G6.registerEdge(
  "circle-running-1",
  {
    afterDraw(cfg, group) {
      // get the first shape in the group, it is the edge's path here=
      const { fillColor, newHull } = cfg;
      const shape = group.get("children")[0];
      // the start position of the edge's path
      const startPoint = shape.getPoint(0);

      // add red circle shape
      const circle = group.addShape("circle", {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: fillColor,
          r: 3,
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "circle-shape",
      });

      newHull && console.log("afterDrawer", circle);
      // animation for the red circle
      circle.animate(
        (ratio) => {
          // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
          // get the position on the edge according to the ratio
          const tmpPoint = shape.getPoint(ratio);
          // returns the modified configurations here, x and y here
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        },
        {
          repeat: false, // Whether executes the animation repeatly
          duration: 1000, // the duration for executing once
        }
      );
      return circle;
    },
  },
  "cubic" // extend the built-in edge 'cubic'
);
