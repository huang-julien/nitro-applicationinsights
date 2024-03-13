import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
    'src/runtime'
  ],
  declaration: true,
  rollup: {
    emitCJS: true
  }
})
