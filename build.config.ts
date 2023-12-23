import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
    entries: [
        {
            builder: 'mkdist',
            input: './runtime'
        },
        {
            builder: 'rollup',
            input: './src/index.ts',
        }
    ],
    declaration: true,
    rollup: {
        emitCJS: true,
        output: {
            exports: "named"
        }
    }
})