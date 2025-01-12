 import { context, propagation } from "@opentelemetry/api"

export default defineTracedEventHandler(async () => {
    const { trace } = await $fetch<{ trace: string }>('/some-dep') 
    const carrier: any = {}
    propagation.inject(context.active(), carrier)
    return {
        trace: carrier.traceparent,
        dependencyTrace: trace,
    }
})