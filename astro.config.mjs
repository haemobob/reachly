import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://reachly.id",
  output: "static",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
});
