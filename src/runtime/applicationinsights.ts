// this file re-export the applicationinsights module. plugin.ts is inlined so we need to avoid having applicationinsights being inlined as well

import * as applicationinsights from 'applicationinsights';
export * from "applicationinsights"
// @ts-ignore wtf applicationinsights ????
export default applicationinsights.default