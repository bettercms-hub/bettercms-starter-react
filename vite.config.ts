import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Expose the deploy Action's build snapshot as `virtual:bcms-content`.
 *
 * A plain `import snapshot from "../bcms-content.json"` would be simpler and is wrong: the file
 * is GITIGNORED (the deploy Action writes it just before the build), so a fresh clone would fail
 * to resolve the import and the build would die before rendering a thing. Reading it here lets
 * an absent snapshot degrade to `{}` — the same "not published yet" path the Astro starter's
 * try/catch gives — while a present one is inlined at build time with no runtime fetch.
 */
function bcmsContent() {
  const id = "virtual:bcms-content";
  const resolved = `\0${id}`;
  const read = () => {
    try {
      return readFileSync(resolve(process.cwd(), "bcms-content.json"), "utf8");
    } catch {
      return "{}";
    }
  };
  return {
    name: "bcms-content",
    resolveId: (source: string) => (source === id ? resolved : null),
    load: (loadedId: string) => (loadedId === resolved ? `export default ${read()}` : null),
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), bcmsContent()],
  // PUBLIC_* as well as VITE_*, so .env.example is byte-identical to the Astro starter's and
  // the deploy Action sets the same variables for all three repos.
  envPrefix: ["VITE_", "PUBLIC_"],
  build: { outDir: "dist" },
});
