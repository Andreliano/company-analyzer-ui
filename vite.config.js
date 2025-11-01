import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {
    version as appVersion,
    name as appName,
} from './package.json';

import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill';

// https://vite.dev/config/
export default defineConfig({
    base: '/app',
    publicDir: '/dist/',
    build: {
        modulePreload: {
            polyfill: true,
        },
        sourcemap: true,
        outDir: 'dist/assets',
        rollupOptions: {
            input: {
                app: 'src/main.js',
            },
            output: {
                entryFileNames: `${appName}-v${appVersion}.js`,
                chunkFileNames: `${appName}-v${appVersion}.js`,
                assetFileNames: `${appName}-v${appVersion}.[ext]`,
                manualChunks: undefined,
            }
        }
    },
    plugins: [
        vue(),
        NodeGlobalsPolyfillPlugin({
            buffer: true
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            global: 'globalThis',
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true
                })
            ],
            define: {
                global: 'globalThis',
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
               @use "@/styles/mixins.scss" as *;
               `
            }
        }
    },
    server: {
        host: 'localhost',
    },
})
