const graphContext = require.context("../components/graph", false, /\.vue$/);
const mapContext = require.context("../components/map", false, /\.vue$/);

function getRoutes(path, context) {
  return context.keys().map((key) => {
    const mod = context(key);
    // console.log(mod);
    const name = key.split(".vue")?.[0].slice(2);
    return {
      path: `/${path}/${name}`,
      name: `${path}-${name}`,
      meta: {
        title: name,
      },
      component: mod.__esModule && mod.default ? mod.default : mod,
    };
  });
}
export const graphRoutes = getRoutes("graph", graphContext);
export const mapRoutes = getRoutes("map", mapContext);
