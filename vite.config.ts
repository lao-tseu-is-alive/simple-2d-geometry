// vite.config.ts
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        sourcemap: true, // Generates source maps
        minify: false, // Do not minify the output
        target: 'esnext', // Build for modern browsers
        lib: {
            entry: './src/index.ts',
            name: '2dGeometry',
            fileName: '2d-geometry',
            formats: ['es', 'umd'] // build ES and umd module format
        },
        rollupOptions: {
            input: './src/index.ts',
            // Ensure external dependencies are not bundled
            external: [],
            output: {
                globals: {}
            }
        },
    },
    plugins: [dts()]
});
