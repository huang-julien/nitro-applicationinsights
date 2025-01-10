# nitro-applicationinsights

[![npm version](https://badge.fury.io/js/nitro-applicationinsights.svg)](https://badge.fury.io/js/nitro-applicationinsights)

Application insight module for [Nitro](https://github.com/unjs/nitro)

## Current features

- application insights configuration at startup
- auto-track requests
- nitro-opentelemetry runtime integration

## Usage

Install package:

```sh
# npm
npm install nitro-applicationinsights

# yarn
yarn add nitro-applicationinsights

# pnpm
pnpm install nitro-applicationinsights
```

Add `nitro-applicationinsights` to the `modules` in your config.

```ts
export default defineNitroConfig({
    modules: ['nitro-applicationinsights']
})
```
 
Et voilà ! You now have application insights node for Nitro

## Docs

[Read more nitro-applicationinsights documentation](https://huang-julien-nitro-applicationinsights.nuxt.space/)

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/packageName?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/packageName
[npm-downloads-src]: https://img.shields.io/npm/dm/packageName?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/packageName
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/packageName/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/packageName
[bundle-src]: https://img.shields.io/bundlephobia/minzip/packageName?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=packageName
