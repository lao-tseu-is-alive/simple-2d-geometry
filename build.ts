import { $ } from "bun";
import { version } from "./package.json";

console.log(`🐰 🏗️  Building workspace packages v${version}...`);

const outputDir = "./dist";
console.log(`🐰 🧹 Cleanup of old ${outputDir} content...`);
await $`rm -rf ${outputDir}`;

const buildPackage = async (pkgName: string, entrypoint: string, hasBrowser: boolean = false) => {
  const pkgFileName = pkgName.split("/").pop()!;
  const pkgOutputDir = `${outputDir}/${pkgFileName}`;
  const sharedConfig = {
    entrypoints: [entrypoint],
    outdir: pkgOutputDir,
    minify: true,
    external: ["lit", "@lao-tseu-is-alive/geom-2d-core"],
    sourcemap: "external" as const,
  };

  console.log(`🐰 📦 Generating bundles for ${pkgName}...`);
  const builds = [
    await Bun.build({ ...sharedConfig, format: "esm", naming: `${pkgFileName}.esm.js` }),
    await Bun.build({ ...sharedConfig, format: "cjs", naming: `${pkgFileName}.cjs.js` }),
  ];
  if (hasBrowser) {
    builds.push(await Bun.build({
      ...sharedConfig,
      entrypoints: [entrypoint.replace("index.ts", "browser.ts")],
      format: "iife",
      naming: `${pkgFileName}.umd.js`,
    }));
  }
  await Promise.all(builds);
};

await buildPackage("@lao-tseu-is-alive/geom-2d-core", "./packages/geom-2d-core/src/index.ts", true);
await buildPackage("@lao-tseu-is-alive/geom-2d-drawing", "./packages/geom-2d-drawing/src/index.ts", false);

console.log("🐰 ✅ Bundles successfully generated !");
console.log("🐰 🎓 Generating Type Definitions...");
// Generate type declarations using tsc
await $`bun x tsc --project tsconfig.json --noEmit false --declaration --emitDeclarationOnly --outDir ${outputDir}/types`;

console.log("🐰 ✅ Build complete!");
