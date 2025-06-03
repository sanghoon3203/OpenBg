import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
    }
  },

  plugins: [
    react()
  ],

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage'
    ]
  },

  build: {
    commonjsOptions: {
      include: [
        /node_modules\/react/,
        /node_modules\/react-dom/,
        /node_modules\/react-router-dom/,
        /node_modules\/react-router/,
        /node_modules\/framer-motion/,
        /node_modules\/lucide-react/,
        /node_modules\/firebase/
      ]
    }
  }
});
