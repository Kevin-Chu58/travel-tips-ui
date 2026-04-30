import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import JavaScriptObfuscator from "javascript-obfuscator";
import type { Plugin } from "vite";
import type { OutputBundle, OutputChunk } from "rollup";
import compression from "vite-plugin-compression";

// Custom plugin to obfuscate JS after build
function obfuscatePlugin(): Plugin {
  return {
    name: "obfuscate-plugin",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle: OutputBundle) {
      for (const [_, file] of Object.entries(bundle)) {
        if (file.type === "chunk") {
          const chunk = file as OutputChunk;
          const obfuscationResult = JavaScriptObfuscator.obfuscate(chunk.code, {
            compact: true,
            controlFlowFlattening: true,
            deadCodeInjection: true,
            stringArray: true,
            rotateStringArray: true,
            stringArrayEncoding: ["base64"],
            identifierNamesGenerator: "mangled", // <- Short variable names
          });
          chunk.code = obfuscationResult.getObfuscatedCode();
        }
      }
    },
  };
}

export default defineConfig({
  base: "/",
  build: {
    // make it hard to read source code
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      mangle: true,
      compress: true,
      format: {
        comments: false,
      },
    },
    // easy import
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  plugins: [
    react(),
    obfuscatePlugin(),
    tsconfigPaths({
      projects: ["./tsconfig.app.json"], // explicitly tell it to use this
    }),
    compression({ algorithm: "brotliCompress", ext: ".br" }),
    compression({ algorithm: "gzip" }),
  ],
  publicDir: "public",
});
