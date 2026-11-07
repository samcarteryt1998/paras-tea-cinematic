import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/paras-tea-cinematic/" : "/",
  build: {
    target: "es2022",
    sourcemap: false,
    assetsInlineLimit: 0
  }
});
