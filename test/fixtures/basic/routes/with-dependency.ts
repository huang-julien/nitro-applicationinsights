 import { context, propagation } from "@opentelemetry/api"

export default defineTracedEventHandler(async () => {
    const { trace } = await $fetch<{ trace: string }>('/some-dep',
 
) 
    const { trace: trace2} = await globalThis.fetch('http://localhost:3000/some-dep',).then((res) => res.json()    )
    const carrier: any = {}
    propagation.inject(context.active(), carrier)
    return {
        trace: carrier.traceparent,
        dependencyTrace: trace,
        trace2
    }
})