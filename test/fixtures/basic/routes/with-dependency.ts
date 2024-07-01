import { defineEventHandler } from "h3"
import { getTraceparentHeaders} from "../../../../src/runtime/utils"
export default defineEventHandler(async (event) => {
    const { trace } = await $fetch<{trace: string}>('/some-dep', {
        headers: getTraceparentHeaders(event)
    })

    return {
        trace: event.$appInsights.trace.toString(),
        dependencyTrace: trace
    }
})