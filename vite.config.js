import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Forwards /api requests to your Express server, so you don't need CORS setup
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
});