const requireContext = require.context("../components/graph", false, /\.vue$/);
export const graphRoutes = requireContext.keys().map((key) => {
  const mod = requireContext(key);
  console.log(mod);
  const name = key.split(".vue")?.[0].slice(2);
  return {
    path: `/graph/${name}`,
    name: `graph-${name}`,
    meta: {
      title: name,
    },
    component: mod.__esModule && mod.default ? mod.default : mod,
  };
});
