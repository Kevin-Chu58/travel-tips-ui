import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import JavaScriptObfuscator from 'javascript-obfuscator';
import type { Plugin } from 'vite';
import type { OutputBundle, OutputChunk } from 'rollup';

// Custom plugin to obfuscate JS after build
function obfuscatePlugin(): Plugin {
  return {
    name: 'obfuscate-plugin',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle: OutputBundle) {
      for (const [_, file] of Object.entries(bundle)) {
        if (file.type === 'chunk') {
          const chunk = file as OutputChunk
          const obfuscationResult = JavaScriptObfuscator.obfuscate(chunk.code, {
            compact: true,
            controlFlowFlattening: true,
            deadCodeInjection: true,
            stringArray: true,
            rotateStringArray: true,
            stringArrayEncoding: ['base64'],
            identifierNamesGenerator: 'mangled', // <- Short variable names
          })
          chunk.code = obfuscationResult.getObfuscatedCode()
        }
      }
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    obfuscatePlugin(),
    tsconfigPaths({
      projects: ['./tsconfig.app.json']  // explicitly tell it to use this
    }),
  ]
});
