import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { UserConfig as VitestUserConfigInterface} from 'vitest/config'
import vue from "@vitejs/plugin-vue"

const vitestConfig: VitestUserConfigInterface = {
  test: {
    globals: true,
    environment: "jsdom",
  },
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath( new URL("./src", import.meta.url)),
    }
  },
  test: vitestConfig.test,
});
