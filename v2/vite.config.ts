import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/antd') || id.includes('@ant-design')) return 'antd';
          if (id.includes('@tanstack/react-query')) return 'query';
          if (id.includes('@tanstack/react-router')) return 'router';
          return undefined;
        },
      },
    },
  },
});
