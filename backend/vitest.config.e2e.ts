import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-e2e.ts'],
    // Comparten la misma BD de pruebas: un archivo a la vez.
    fileParallelism: false,
    hookTimeout: 30_000,
  },
});
