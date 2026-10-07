import type { Env as EnvWorker } from "../src/worker";

// Los bindings de wrangler.toml, para `env` de cloudflare:test.
declare global {
  namespace Cloudflare {
    interface Env extends EnvWorker {}
  }
}

export {};
