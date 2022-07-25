require("esbuild").build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    outfile: "dist/tblswvs.js",
    platform: "node",
    target: "es6",
}).catch(() => process.exit(1))
