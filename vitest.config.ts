// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            // https://vitest.dev/guide/coverage.html
            provider: 'v8'   //'istanbul' or 'v8'
        },
    },
})
