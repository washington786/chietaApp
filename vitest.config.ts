import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
    },
    define: {
        __DEV__: 'false',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'expo-network': path.resolve(__dirname, 'src/test/mocks/expoNetwork.ts'),
        },
    },
})
