import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Tauri expects a fixed dev port and reads TAURI_ENV_* variables at build time.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: { ignored: ['**/src-tauri/**'] },
  },
  envPrefix: ['VITE_', 'TAURI_ENV_'],
  build: {
    target: 'es2023',
    sourcemap: Boolean(process.env.TAURI_ENV_DEBUG),
    // The chart chunk is ~515 KB raw; its real budget (250 KB gzip) is checked by e2e/chart.spec.ts.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        // ECharts gets its own chunk so e2e can hold it to the 250 KB gzip budget (ADR-0014).
        codeSplitting: {
          groups: [{ name: 'chart', test: /node_modules[\\/](?:\.pnpm[\\/])?(?:echarts|zrender)/ }],
        },
      },
    },
  },
});
