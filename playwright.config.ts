import { defineConfig, devices } from "@playwright/test";

// Puerto 3100: el 3001 está reservado para el cargador de propiedades.
const PUERTO = 3100;

export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  retries: 0,
  use: { baseURL: `http://localhost:${PUERTO}` },
  projects: [
    // WebKit (motor real del iPhone) se cae en esta máquina por memoria; Chromium emula
    // el iPhone 13 (pantalla, touch, isMobile, user agent), suficiente para la navegación.
    { name: "iphone", use: { ...devices["iPhone 13"], browserName: "chromium" } },
    { name: "escritorio", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `npx next dev -p ${PUERTO}`,
    url: `http://localhost:${PUERTO}`,
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
    env: { ASISTENTE_ENABLED: "true" },
  },
});
