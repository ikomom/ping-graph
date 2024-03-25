import G6 from "@antv/g6";

G6.registerEdge(
  "circle-running",
  {
    setState(name, value, item) {
      if (name === "highlight") {
        const { fillColor } = item.getModel();
        const shape = item.getKeyShape();
        const startPoint = shape.getPoint(0);
        const circle = item.getContainer().getChildren()[1];
        // newHull && console.log("afterDrawer", circle);
        // animation for the red circle
        if (!circle) return;
        if (value) {
          circle.show();
          circle.animate(
            (ratio) => {
              // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
              // get the position on the edge according to the ratio
              const tmpPoint = shape.getPoint(ratio);
              // returns the modified configurations here, x and y here
              return {
                x: tmpPoint.x,
                y: tmpPoint.y,
                fill: fillColor,
              };
            },
            1000,
            null,
            () => {
              console.log("animation finished");
              circle.hide();
            }
          );
        } else {
          circle.stopAnimate();
          circle.attr({
            x: startPoint.x,
            y: startPoint.y,
            fill: fillColor,
          });
          circle.hide();
        }
      }
    },
    afterDraw(cfg, group) {
      const { fillColor } = cfg;
      const shape = group.get("children")[0];
      const startPoint = shape.getPoint(0);
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
      circle.hide();
      return circle;
    },
  },
  "cubic" // extend the built-in edge 'cubic'
);
