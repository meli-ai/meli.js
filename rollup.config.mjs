import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const plugins = [
  nodeResolve({
    jsnext: true,
  }),
  typescript({
    sourceMap: false,
  }),
  terser(),
];

export default {
  input: "src/meli.ts",
  output: {
    file: "out/bundle.min.js",
    name: "meli.js",
    format: "umd",
    sourcemap: false,
  },
  plugins,
};
