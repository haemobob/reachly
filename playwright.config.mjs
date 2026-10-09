import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  outputDir: '.artifacts/arena/test-results',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure'
  },
  projects: [320, 375, 768, 1024, 1440].map(width => ({
    name: 'chromium-' + width,
    use: { viewport: { width, height: 1000 } }
  })),
  webServer: {
    command: 'python -m http.server 4173 --bind 127.0.0.1 --directory dist',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 30000
  }
});
