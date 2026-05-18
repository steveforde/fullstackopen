// Import the defineConfig helper from Vite
// defineConfig provides TypeScript intellisense and better configuration validation
import { defineConfig } from 'vite'

// Import the official Vite React plugin
// Enables React Fast Refresh (HMR), JSX transformation, and React optimizations
import react from '@vitejs/plugin-react'

// Export the Vite configuration object
export default defineConfig({
  // ========== PLUGINS ==========
  // React plugin for JSX support and Fast Refresh
  plugins: [react()],

  // ========== DEVELOPMENT SERVER ==========
  server: {
    // Proxy configuration - redirects API requests during development
    proxy: {
      // Intercept any requests that start with '/api'
      '/api': {
        // Forward these requests to your backend server
        // This assumes your backend is running on port 3003
        target: 'http://localhost:3003',

        // changeOrigin: true - modifies the origin header of the proxied request
        // This prevents CORS errors by making the request appear to come from the target
        // Without this, some backends might reject requests from different origins
        changeOrigin: true,
      },
    },
  },

  // ========== TEST CONFIGURATION (Vitest) ==========
  test: {
    // environment: 'jsdom' - Simulates a browser environment for testing
    // Provides DOM APIs (document, window, localStorage, etc.)
    environment: 'jsdom',

    // globals: true - Makes Vitest APIs available globally
    // No need to import describe, it, expect, vi in test files
    globals: true,

    // setupFiles: Path to file that runs before all tests
    // Use for global test setup, cleanup, or mocking
    setupFiles: './src/test_setup.js',
  },
})
