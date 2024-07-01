import { defineEventHandler } from "h3";

export default defineEventHandler((event) => {
    console.log('hello')
    return {
        trace: event.$appInsights.trace.toString(),
        initialTrace: event.$appInsights.initialTrace,
    }
})