import { defineEventHandler, setResponseHeader } from "h3";
 
 
import { context, propagation } from "@opentelemetry/api"
export default defineTracedEventHandler((event) => {
    const carrier: any = {}
    propagation.inject(context.active(), carrier)
    setResponseHeader(event, 'x-trace',carrier.traceparent)
    return new Error('error message')
})