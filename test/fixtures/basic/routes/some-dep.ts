import { defineEventHandler } from "h3";
import { context, propagation } from "@opentelemetry/api"


export default defineTracedEventHandler(async (event) => {
     const carrier: any = {} 
    propagation.inject(context.active(), carrier)
    return {
        trace: carrier.traceparent,
    }
})