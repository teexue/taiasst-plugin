import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";
import type { UserConfig, ConfigEnv } from "vite";

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [react()],
    define: {
      "process.env": {
        NODE_ENV: JSON.stringify(mode),
      },
      "process.env.NODE_ENV": JSON.stringify(mode),
      __APP_ENV__: JSON.stringify(mode),
    },

    build: {
      lib: {
        entry: resolve("./src/index.tsx"),
        name: "TaiAsstPlugin",
        fileName: () => `plugin.js`,
        formats: ["umd"],
      },
      rollupOptions: {
        external: [
          "react",
          "react-dom",
          "antd",
          "@ant-design/icons",
          "react-router",
        ],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            antd: "antd",
            "@remixicon/react": "RemixIcon",
            "react-router": "ReactRouter",
          },
        },
      },
    },
  };
});
