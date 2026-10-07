import { defineConfig } from "vitest/config";
import { cloudflareTest } from "@cloudflare/vitest-plugin";

// Los tests corren dentro de workerd (el mismo runtime que producción): hay
// HTMLRewriter, Cache API y un R2 local por test.
export default defineConfig({
  plugins: [cloudflareTest({ wrangler: { configPath: "./wrangler.toml" } })],
});
