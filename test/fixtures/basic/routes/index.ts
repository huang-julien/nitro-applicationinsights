 import { context, propagation } from "@opentelemetry/api"
 
export default defineTracedEventHandler((event) => {
    const carrier: any = {}
    propagation.inject(context.active(), carrier) 
    return {
        trace: carrier.traceparent,

         parentSpanId: event.otel.span.parentSpanContext.spanId,
    }
})