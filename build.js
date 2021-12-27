const  build = require('esbuild')

build.buildSync({
    bundle: true,
    platform: "node",
    entryPoints: [process.argv[2]],
    minify: false,
    sourcemap: "external",
    outdir: process.argv[3]
})