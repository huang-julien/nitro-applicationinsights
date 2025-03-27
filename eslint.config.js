import unjs from "eslint-config-unjs";

export default unjs({
  ignores: [
    'node_modules',
    'coverage',
    'dist',
    '**/.nitro',
    '**/.output',
    './docs/**'
  ]
});